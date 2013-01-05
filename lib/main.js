/**
 * APM
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var build = require('./action/build'),
	clean = require('./action/clean'),
	install = require('./action/install'),
	reset = require('./action/reset');

var config = {
		'build': [ clean, install, build ],
		'clean': [ clean ],
		'install': [ clean, install ],
		'reset': [ reset ]
	},

	/**
	 * Perform an action.
	 * @param action {string}
	 */
	run = function (action) {
		var queue = config[action],
			len = queue.length,
			i = 0;

		(function next() {
			if (i < queue.length) {
				queue[i++].call(null, next);
			}
		}());
	};

exports.run = run;
