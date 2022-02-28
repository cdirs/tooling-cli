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

	vars = {
		...vars,
		...(await ask([
			{
				type: 'toggle',
				name: 'delete',
				message: 'Delete current automations?',
				hint: `Remove all traces of previous automations ready for updated ones.`,
				enabled: 'Yes',
				disabled: 'No',
				initial: true
			},
			{
				type: 'select',
				name: 'type',
				message: 'Project Type?',
				initial: 1,
				required: true,
				choices: [
					{
						message: 'Netlify',
						value: 'netlify',
						hint: 'For a website that will be deployed to Netlify'
					},
					{
						message: 'Microservice',
						value: 'microservice',
						hint: 'For a Microservice that will be deployed to Google Cloud'
					},
					{
						message: 'NPM Package',
						value: 'npmPackage',
						hint: 'For a standard NPM package where no extra build steps are required'
					}
				]
			}
		]))
	};

	return vars;
};
