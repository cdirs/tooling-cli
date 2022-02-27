module.exports = {
	image: {
		file: '.gitpod.Dockerfile'
	},
	github: {
		prebuilds: {
			master: true,
			branches: true,
			pullRequests: true,
			pullRequestsFromForks: true,
			addCheck: false,
			addComment: false,
			addBadge: false
		}
	}
};
