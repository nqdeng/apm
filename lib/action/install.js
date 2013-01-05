/**
 * APM - Action - Install
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var spm = require('spm');

var	TARGET = 'sea-modules',

	/**
	 * Run action.
	 * @param next {Function}
	 */
	run = function (next) {
		spm.getAction('install').run({
			force: true,
			to: TARGET
		}, next);
	};

module.exports = run;
