/**
 * APM - SVN
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path'),
	util = require('./util');

	/**
	 * Put a file or directory under version control.
	 * @param pathname {string}
	 * @param callback {Function}
	 */
var	add = exports.add = function (pathname, callback) {
		exec(util.format('svn add %s', pathname), callback);
	},

	/**
	 * Detect whether a file or directory is under SVN version control.
	 * @param pathname {string}
	 * @return {boolean}
	 */
	detect = exports.detect = function (pathname) {
		var parent;

		if (fs.existsSync(path.join(pathname, '.svn'))) {
			return true;
		} else {
			parent = path.join(pathname, '../');
			return parent !== pathname ? detect(parent) : false;
		}
	},

	/**
	 * Remove a file or directory from version control.
	 * @param pathname {string}
	 * @param callback {Function}
	 */
	rm = exports.rm = function (pathname, callback) {
		exec(util.format('svn delete %s --force', pathname), callback);
	},

	DUMMY;
