const child_process = require('child_process');

module.exports = async (command, output = false) =>
  new Promise((resolve, reject) => {
    child_process.exec(command, (err, stdout, stderr) => {
      resolve(err ? err : stdout);
    });
  });
