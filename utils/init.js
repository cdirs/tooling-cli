const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');

module.exports = ({ clear = true }) => {
	unhandled();
	welcome({
		title: `t3k`,
		tagLine: `by Simon`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#ff8c00',
		color: '#000000',
		bold: true,
		clear
	});
};
