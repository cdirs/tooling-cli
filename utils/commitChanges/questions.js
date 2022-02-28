const ask = require('../ask');
const fs = require('fs');

module.exports = async (addAll = false, autoPush = false) => {
	let vars = {};

	const currentPackageJson = JSON.parse(fs.readFileSync('package.json'));

	if (addAll !== true) {
		vars = {
			...vars,
			...(await ask([
				{
					type: 'toggle',
					name: 'addAll',
					message: 'Add all changes?',
					hint: `Ensures that all changes and new files are added to this commit.`,
					enabled: 'Yes',
					disabled: 'No',
					initial: addAll
				}
			]))
		};
	}

	if (autoPush !== true) {
		vars = {
			...vars,
			...(await ask([
				{
					type: 'toggle',
					name: 'autoPush',
					message: 'Push changes?',
					hint: `Automatically push changes when commit is complete.`,
					enabled: 'Yes',
					disabled: 'No',
					initial: autoPush
				}
			]))
		};
	}

	vars = {
		...vars,
		...(await ask([
			{
				type: 'select',
				name: 'type',
				message: 'What time of change are you committing?',
				initial: 1,
				required: true,
				choices: [
					{
						message: 'feat:',
						value: 'feat',
						hint: 'A new feature'
					},
					{
						message: 'fix:',
						value: 'fix',
						hint: 'A bug fix'
					},
					{
						message: 'docs:',
						value: 'docs',
						hint: 'Documentation only changes'
					},
					{
						message: 'style:',
						value: 'style',
						hint: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
					},
					{
						message: 'refactor:',
						value: 'refactor',
						hint: 'A code change that neither fixes a bug nor adds a feature'
					},
					{
						message: 'perf:',
						value: 'perf',
						hint: 'A code change that improves performance'
					},
					{
						message: 'test:',
						value: 'test',
						hint: 'Adding missing tests of correcting existing tests'
					},
					{
						message: 'build:',
						value: 'build',
						hint: 'Changes that affect the build system or external dependencies (example scopes: gulp, npm)'
					},
					{
						message: 'ci:',
						value: 'ci',
						hint: 'Changes to out CI/CD configuration files and scripts'
					},
					{
						message: 'chore:',
						value: 'chore',
						hint: "Other changes that don't modify src or test files"
					},
					{
						message: 'revert:',
						value: 'revert',
						hint: 'Reverts a previous commit'
					}
				]
			},
			{
				type: 'input',
				name: 'scope',
				message: 'What is the scope of this change (Optional):',
				hint: `(e.g. component or file name)`,
				required: false,
				format: val => val.toLowerCase()
			}
		]))
	};

	const remainingCharacters = 92 - vars.scope.length;

	vars = {
		...vars,
		...(await ask([
			{
				type: 'input',
				name: 'description',
				message: `Write a short, imperative tense description (max ${remainingCharacters} chars):`,
				required: true,
				format: val =>
					`${val[0] ? val[0].toLowerCase() : ''}${val.substring(1)}`,
				validate: val =>
					val.length <= remainingCharacters
						? true
						: `Too long, maxiumum is ${remainingCharacters} characters and you used ${val.length}.`
			},
			{
				type: 'input',
				name: 'longDescription',
				message:
					'Provide a longer description of the change (Optional):',
				required: false
			},
			{
				type: 'toggle',
				name: 'breaking',
				message: 'Are there any breaking changes?',
				enabled: 'Yes',
				disabled: 'No',
				initial: false
			}
		]))
	};

	if (vars.breaking === true) {
		vars = {
			...vars,
			...(await ask([
				{
					type: 'input',
					name: 'breakingDescription',
					message: 'Describe the breaking changes:',
					required: true
				}
			]))
		};
	}

	vars = {
		...vars,
		...(await ask([
			{
				type: 'toggle',
				name: 'fixes',
				message: 'Does this change affect any open issues?',
				enabled: 'Yes',
				disabled: 'No',
				initial: false
			}
		]))
	};

	if (vars.fixes === true) {
		vars = {
			...vars,
			...(await ask([
				{
					type: 'input',
					name: 'issueReferences',
					message: 'Add issue references (e.g. "fixes #123"):',
					required: true
				}
			]))
		};
	}

	return vars;
};
