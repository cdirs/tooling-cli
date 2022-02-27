const run = require('../run');

module.exports = async (addAll = false, autoPush = false) => {
	if (addAll) {
		// Always pull first
		await run('git pull');

		try {
			await run('git add -A');
		} catch (e) {
			console.error(e);
		}
	}

	try {
		console.log(await run('npx tk-cz'));
	} catch (e) {
		console.error(e);
	}

	if (autoPush) {
		try {
			await run('git push');
		} catch (e) {
			console.error(e);
		}
	}
};
