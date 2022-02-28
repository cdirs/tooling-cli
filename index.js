#!/usr/bin/env node

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const updateProject = require('./utils/updateProject');
const commitChanges = require('./utils/commitChanges');
const selfUpdate = require('./utils/selfUpdate');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
  init({ clear });

  (input.length === 0 || input.includes(`help`)) && cli.showHelp(0);

  input.includes(`update`) && (await updateProject());
  input.includes(`commit`) &&
    (await commitChanges(flags.addAll, flags.autoPush));

  input.includes(`selfUpdate`) && selfUpdate();

  debug && log(flags);
})();
