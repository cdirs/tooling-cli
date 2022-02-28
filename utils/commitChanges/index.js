const run = require('../run');
const questions = require('./questions');

module.exports = async (addAll = false, autoPush = false) => {
	// Ensure correct pull type
	await run('git config pull.rebase false');

	// Always pull first
	await run('git pull');

	const {
		addAll: addAllAnswer,
		autoPush: autoPushAnswer,
		type,
		scope,
		description,
		longDescription,
		breaking,
		breakingDescription,
		fixes,
		issueReferences
	} = await questions(addAll, autoPush);

	const commitMessage = `${type}${scope.length > 0 ? `(${scope})` : ''}${
		breaking ? '!' : ''
	}: ${description}${
		longDescription.length > 0
			? `
	
${longDescription.length > 0 ? longDescription : ''}`
			: ''
	}${
		breaking || fixes
			? `

`
			: ''
	}${breaking ? `BREAKING CHANGE: ${breakingDescription}` : ''}
${fixes ? `Refs: ${issueReferences}` : ''}`;

	if (addAll == true || addAllAnswer === true) {
		try {
			await run('git add -A');
		} catch (e) {
			console.error(e);
		}
	}

	try {
		await run(`git commit -m '${commitMessage}'`);
	} catch (e) {
		console.error(e);
	}

	if (autoPush === true || autoPushAnswer === true) {
		try {
			await run('git push');
		} catch (e) {
			console.error(e);
		}
	}
};
