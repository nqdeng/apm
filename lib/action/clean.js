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
	 * Remove from simple file system.
	 * @param target {Array}
	 */
	simpleRemove = function (target) {
		target.forEach(function (pathname) {
			util.rm(pathname);
		});
	},

	/**
	 * Remove from SVN repository.
	 * @param target {Array}
	 * @param callback {Function}
	 */
	svnRemove = function (target, callback) {
		(function next(i) {
			if (i < target.length) {
				svn.rm(target[i], function (err) {
					if (err) {
						callback(err);
					} else {
						next(i + 1);
					}
				});
			} else {
				callback(null);
			}
		}(0));
	},

	/**
	 * Run action.
	 * @param next {Function}
	 */
	run = function (next) {
		if (svn.detect(process.cwd())) {
			svnRemove(TARGET, function (err) {
				if (err) {
					throw err;
				} else {
					next();
				}
			});
		} else {
			simpleRemove(TARGET);
			next();
		}
	};

module.exports = run;
