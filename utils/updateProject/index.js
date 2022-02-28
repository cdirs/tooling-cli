const questions = require('./questions');
const fs = require('fs');
const ora = require('ora');
const del = require('del');
const alert = require('cli-alerts');
const yaml = require('js-yaml');
const axios = require('axios');
const run = require('../run');
const defaultGitPodYaml = require('./defaultGitPodYaml');
const gitpodYamlDefaults = require('./projects/gitpodYaml');
const { green: g, yellow: y, dim: d } = require('chalk');
const commitAndRecoverStash = require('./commitAndRecoverStash');

const spinner = ora({ text: '' });

module.exports = async () => {
  const vars = await questions();

  spinner.start(`Stashing current changes`);
  await run('git stash');
  spinner.succeed(`Current changes stashed`);

  spinner.start(`Generating Automations`);

  if (vars.delete === true) await del('.github');

  // Make the required directories
  await new Promise((resolve, reject) => {
    fs.mkdir('.github/workflows', { recursive: true }, err => {
      if (err) reject(err);

      resolve();
    });
  });

  const actionYaml = yaml.load(
    await axios(
      `https://raw.githubusercontent.com/tech3k/actions/main/templates/${vars.type}.yml`
    ).then(r => r.data)
  );

  // Add in service name
  if (vars.serviceName) {
    actionYaml.jobs.CloudRun['with'] = { SERVICE_NAME: vars.serviceName };
  }
  // Add in base url
  if (vars.baseUrl) {
    actionYaml.jobs.Netlify['with'] = { NETLIFY_URL: vars.baseUrl };
  }
  // Add in Apple App ID
  if (vars.appleAppId) {
    actionYaml.jobs.Expo['with'] = { APPLE_APP_ID: vars.appleAppId };
  }

  if (vars.type === 'expo') {
    fs.writeFileSync(
      'eas.json',
      `{
  "build": {
    "main": {
      "releaseChannel": "main"
    },
    "staging": {
      "releaseChannel": "staging"
    }
  }
}`
    );
  }

  fs.writeFileSync(
    '.github/workflows/deploy.yml',
    yaml.dump({ ...actionYaml })
  );

  spinner.succeed(`Automations Generated`);

  if (vars.gitpod === true) {
    spinner.start(`Setting up GitPod`);
    let gitpodYaml = {};
    if (fs.existsSync('.gitpod.yml')) {
      gitpodYaml = yaml.load(fs.readFileSync('.gitpod.yml', 'utf8'));
    } else {
      gitpodYaml = { ...(gitpodYamlDefaults[vars.type] ?? {}) };
    }

    const gitpodDump = { ...gitpodYaml, ...defaultGitPodYaml };

    if (!gitpodDump.tasks && !gitpodDump.tasks[0]) {
      gitpodDump.tasks = [
        {
          before: 'npm install t3k --global'
        }
      ];
    } else if (!gitpodDump.tasks[0].before) {
      gitpodDump.tasks[0]['before'] = 'npm install t3k --global';
    }

    fs.writeFileSync('.gitpod.yml', yaml.dump(gitpodDump, { indent: 2 }));

    spinner.succeed(`GitPod Ready`);
  }

  if (vars.codeStandards === true) {
    spinner.start(`Synching Code Standards`);
    // Code Standards
    spinner.succeed(`Code Standards Synched`);
  }

  await commitAndRecoverStash(
    `ci(update): updated actions and other files to the latest version`
  );

  alert({
    type: `success`,
    name: `ALL DONE`,
    msg: `Project is ready to go`
  });
};
