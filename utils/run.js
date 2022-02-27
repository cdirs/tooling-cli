const child_process = require('child_process');

module.exports = async command => {
	try {
		child_process.execSync(command, { stdio: 'inherit' });
	} catch (e) {}
};
