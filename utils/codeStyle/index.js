const fs = require('fs');
const yaml = require('js-yaml');
const defaultGitPodYaml = require('../updateProject/defaultGitPodYaml');
const ora = require('ora');
const spinner = ora({ text: '' });

module.exports = async () => {
  spinner.start(`Synching Code Standards`);
  fs.writeFileSync(
    '.prettierrc.json',
    `{
  "trailingComma": "all",
  "arrowParens": "avoid",
  "singleQuote": true,
  "printWidth": 80,
  "useTabs": false,
  "tabWidth": 2,
  "semi": true
}`,
  );

  if (fs.existsSync('.gitpod.yml')) {
    gitpodYaml = yaml.load(fs.readFileSync('.gitpod.yml', 'utf8'));
    const updatedYaml = { ...gitpodYaml, ...defaultGitPodYaml };
    fs.writeFileSync('.gitpod.yml', yaml.dump(updatedYaml, { indent: 2 }));
  }
  spinner.succeed(`Code Standards Synched`);
};
