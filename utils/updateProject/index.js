const questions = require('./questions');
const fs = require('fs');
const ora = require('ora');
const del = require('del');
const alert = require('cli-alerts');
const yaml = require('js-yaml');
const axios = require('axios');
const defaultGitPodYaml = require('./defaultGitPodYaml');
const gitpodYamlDefaults = require('./projects/gitpodYaml');
const { green: g, yellow: y, dim: d } = require('chalk');

const spinner = ora({ text: '' });

module.exports = async () => {
	const vars = await questions();

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

		if (!gitpodDump.tasks?.before) {
			gitpodDump.tasks = {
				...gitpodDump.tasks,
				before: 'npm install t3k --global'
			};
		}
		// 		fs.writeFileSync(
		// 			'.gitpod.Dockerfile',
		// 			`FROM gitpod/workspace-full

		// RUN npm install t3k tk-cz --global`
		// 		);

		fs.writeFileSync('.gitpod.yml', yaml.dump(gitpodDump));

		spinner.succeed(`GitPod Ready`);
	}

	if (vars.codeStandards === true) {
		spinner.start(`Synching Code Standards`);
		// Code Standards
		spinner.succeed(`Code Standards Synched`);
	}

	alert({
		type: `success`,
		name: `ALL DONE`,
		msg: `Project is ready to go`
	});
};
