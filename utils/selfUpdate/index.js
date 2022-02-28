const run = require('../run');
const ora = require('ora');
const spinner = ora({ text: '' });
const alert = require('cli-alerts');

module.exports = async () => {
  spinner.start(`Installing latest version`);
  await run(`npm install t3k@latest --global`);
  spinner.succeed(`Latest version installed`);

  alert({
    type: `success`,
    name: `ALL DONE`,
    msg: `Latest version of the t3k is installed`,
  });
};
