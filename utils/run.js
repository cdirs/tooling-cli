const child_process = require('child_process');

module.exports = async (command, output = false) => {
	try {
		child_process.execSync(
			command,
			output === true ? { stdio: 'inherit' } : {}
		);
	} catch (e) {}
};
