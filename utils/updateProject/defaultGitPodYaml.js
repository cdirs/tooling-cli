module.exports = {
  github: {
    prebuilds: {
      master: true,
      branches: true,
      pullRequests: true,
      pullRequestsFromForks: true,
      addCheck: false,
      addComment: false,
      addBadge: false,
    },
  },
  vscode: {
    extensions: ['esbenp.prettier-vscode'],
  },
};
