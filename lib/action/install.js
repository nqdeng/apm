/**
 * APM - Action - Install
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var spm = require('spm'),
	svn = require('../svn');

var	TARGET = 'sea-modules',

	/**
	 * Run action.
	 * @param next {Function}
	 */
	run = function (next) {
		spm.getAction('install').run({
			force: true,
			to: TARGET
		}, function () {
			svn.detect('.', function (result) {
				if (result) {
					svn.add(TARGET, function (err) {
						if (err) {
							throw err;
						} else {
							next();
						}
					});
				} else {
					next();
				}
			});
		});
	};

module.exports = run;
