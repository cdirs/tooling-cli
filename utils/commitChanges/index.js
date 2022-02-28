const run = require('../run');
const questions = require('./questions');

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

	const commitAnswers = questions(addAll, autoPush);

	if (autoPush) {
		try {
			await run('git push');
		} catch (e) {
			console.error(e);
		}
	}
};
