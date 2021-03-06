const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
  addAll: {
    type: `boolean`,
    default: false,
    alias: `A`,
    desc: `Adds all changes to git`,
  },
  autoPush: {
    type: `boolean`,
    default: false,
    alias: `p`,
    desc: `Automatically pushes after a commit`,
  },
};

const commands = {
  standards: {
    desc: `Applies the latest coding standards to the repository`,
  },
  update: {
    desc: `Updates this repo to be a Tech3k project and installs some defaults`,
  },
  commit: {
    desc: `Commits a change to git`,
  },
  selfUpdate: {
    desc: `Updates the local version of the t3k command`,
  },
  help: { desc: `Print help info` },
};

const helpText = meowHelp({
  name: `t3k`,
  flags,
  commands,
});

const options = {
  inferType: true,
  description: false,
  hardRejection: false,
  flags,
};

module.exports = meow(helpText, options);
