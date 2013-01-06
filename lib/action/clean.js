/**
 * APM - Action - Clean
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var svn = require('../svn'),
	util = require('../util');

var	TARGET = [
		'sea-modules',
		'sea-config.js',
		'sea-config-dev.js'
	],

	/**
	 * Run action.
	 * @param next {Function}
	 */
	run = function (next) {
		var pathname;

		(function next2(i) {
			if (i < TARGET.length) {
				pathname = TARGET[i];
				svn.detect(pathname, function (result) {
					if (result) {
						svn.rm(pathname, function (err) {
							if (err) {
								throw err;
							} else {
								next2(i + 1);
							}
						});
					} else {
						util.rm(pathname);
						next2(i + 1);
					}
				});
			} else {
				next();
			}
		}(0));
	};

module.exports = run;
