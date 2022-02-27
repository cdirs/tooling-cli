#!/usr/bin/env node

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const initProject = require('./utils/initProject');
const commitChanges = require('./utils/commitChanges');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	input.includes(`init`) && (await initProject());
	input.includes(`commit`) &&
		(await commitChanges(flags.addAll, flags.autoPush));

	debug && log(flags);
})();
