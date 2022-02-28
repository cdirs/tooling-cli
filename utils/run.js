const child_process = require('child_process');

module.exports = async (command, output = false) =>
  new Promise((resolve, reject) => {
    try {
      const process = child_process.execSync(command);
      resolve(process);
    } catch (e) {}
  });
