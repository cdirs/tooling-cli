module.exports = {
	microservice: {
		ports: [{ port: 8080, onOpen: 'notify' }],
		tasks: [
			{
				init: 'yarn install',
				before: 'npm install t3k --global',
				command: 'yarn start'
			}
		]
	},
	netlify: {
		ports: [
			{ port: 3000, onOpen: 'ignore' },
			{ port: 8888, onOpen: 'open-preview' }
		],
		tasks: [
			{
				init: 'yarn install',
				before: 'npm install t3k --global',
				command: 'yarn netlify:dev'
			}
		]
	}
};
