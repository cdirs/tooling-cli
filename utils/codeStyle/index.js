const fs = require('fs');
const yaml = require('js-yaml');
const defaultGitPodYaml = require('../updateProject/defaultGitPodYaml');

module.exports = async () => {
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
};
