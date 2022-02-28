const run = require('../run');
const questions = require('./questions');
const ora = require('ora');
const spinner = ora({ text: '' });
const alert = require('cli-alerts');

module.exports = async (addAll = false, autoPush = false) => {
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

	// Always pull first
	spinner.start(`Pulling latest changes`);
	// Ensure correct pull type
	await run('git config pull.rebase false');
	await run('git pull');
	spinner.succeed(`Latest changes pulled`);

	if (addAll == true || addAllAnswer === true) {
		try {
			spinner.start(`Adding all files`);
			await run('git add -A');
			spinner.succeed(`All files added`);
		} catch (e) {
			console.error(e);
		}
	}

	try {
		spinner.start(`Generating commit message`);
		await run(`git commit -m '${commitMessage}'`);
		spinner.succeed(`Commit message generated`);
	} catch (e) {
		console.error(e);
	}

	if (autoPush === true || autoPushAnswer === true) {
		try {
			spinner.start(`Pushing changes`);
			await run('git push');
			spinner.succeed(`Changes pushed`);
		} catch (e) {
			console.error(e);
		}
	}

	alert({
		type: `success`,
		name: `ALL DONE`,
		msg: `Commit has been done, everything is safe`
	});
};
