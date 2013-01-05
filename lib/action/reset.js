/**
 * APM - Action - Reset
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var spm = require('spm');

	/**
	 * Run action.
	 * @param next {Function}
	 */
var	run = function (next) {
		spm.getAction('env').run({
			clean: true,
		}, next);
	};

module.exports = run;
