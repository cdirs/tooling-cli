const run = require('../run');
const ora = require('ora');
const spinner = ora({ text: '' });

module.exports = async (commitMessage, autoPush = true) => {
	// Always pull first
	spinner.start(`Pulling latest changes`);
	// Ensure correct pull type
	await run('git config pull.rebase false');
	await run('git pull');
	spinner.succeed(`Latest changes pulled`);

	spinner.start(`Adding all files`);
	await run('git add -A');
	spinner.succeed(`All files added`);

	try {
		spinner.start(`Generating commit message`);
		await run(`git commit -m '${commitMessage}'`);
		spinner.succeed(`Commit message generated`);
	} catch (e) {
		console.error(e);
	}

	if (autoPush === true) {
		try {
			spinner.start(`Pushing changes`);
			await run('git push');
			spinner.succeed(`Changes pushed`);
		} catch (e) {
			console.error(e);
		}
	}

	spinner.start(`Recovering stashed changes`);
	await run('git stash apply');
	spinner.succeed(`Stashed changes recovered`);
};
