/**
 * APM - Action - Build
 * Copyright(c) 2012 ~ 2013 Alibaba.com, Inc.
 * MIT Licensed
 */

var fs = require('fs'),
	path = require('path');
	spm = require('spm'),
	svn = require('../svn'),
	util = require('../util');

var	BASE_TMPL = '/js/6v/biz/%s/sea-modules',

	CONFIG_TMPL = 'seajs.config({alias:<%=alias%>,base:(location.protocol==="https:"?"https://stylessl.aliunicorn.com":"http://style.aliunicorn.com")+"<%=base%>"});',

	SUBMODULE_PATH_TMPL = 'local/%s/%s',

	SUBMODULE_PATH_DEV_TMPL = 'local/../../local/%s',

	/**
	 * Generate config files.
	 * @param calback {Function}
	 */
	config = function (callback) {
		var moduleName = pkg().name,
			base = util.format(BASE_TMPL, moduleName),
			alias = {},
			aliasDev = {};

		subModules().forEach(function (name) {
			var key = moduleName + '.' + name;

			alias[key] =
				util.format(SUBMODULE_PATH_TMPL, name, version(name));
			aliasDev[key] =
				util.format(SUBMODULE_PATH_DEV_TMPL, name);
		});

		util.mix(alias, pkg().dependencies);
		util.mix(aliasDev, pkg().dependencies);

		fs.writeFileSync('sea-config.js', util.tmpl(CONFIG_TMPL, {
			alias: JSON.stringify(alias),
			base: base
		}));

		fs.writeFileSync('sea-config-dev.js', util.tmpl(CONFIG_TMPL, {
			alias: JSON.stringify(aliasDev),
			base: base
		}));

		svn.detect('.', function (result) {
			if (result) {
				svn.add('sea-config.js', function (err) {
					if (err) {
						throw err;
					} else {
						svn.add('sea-config-dev.js', function (err) {
							if (err) {
								throw err;
							} else {
								callback();
							}
						});
					}
				});
			} else {
				callback();
			}
		});
	},

	/**
	 * Generate output config for a sub module.
	 * @param name {string}
	 * @return {Object}
	 */
	output = function (name) {
		var pathname = path.join('local', name),
			customOutput = path.join(pathname, 'output.json'),
			output;

		if (fs.existsSync(customOutput)) {
			return JSON.parse(fs.readFileSync(customOutput, 'utf8'));
		} else {
			output = {
				'i18n/*.js': '.'
			};

			fs.readdirSync(pathname)
				.filter(function (item) {
					item = path.join(pathname, item);

					return fs.statSync(item).isFile()
						&& path.extname(item) === '.js';
				})
				.forEach(function (item) {
					output[item] = '.';
				});

			return output;
		}
	},

	/**
	 * Read package.json.
	 * @return {Object}
	 */
	pkg = (function () {
		var cache = null;

		return function () {
			if (!cache) {
				cache = fs.readFileSync('package.json', 'utf8');
			}

			return JSON.parse(cache);
		};
	}()),

	/**
	 * Run action.
	 * @param next {Function}
	 */
	run = function (next) {
		var build = spm.getAction('build'),
			options = task(),
			len = options.length,
			i = 0;

		(function next2() {
			if (i < len) {
				build.run(options[i++], next2);
			} else {
				svn.detect('sea-modules', function (result) {
					if (result) {
						svn.add(path.join('sea-modules', 'local'), function (err) {
							if (err) {
								throw err;
							} else {
								config(next);
							}
						});
					} else {
						config(next);
					}
				});
			}
		}());
	},

	/**
	 * Get names of sub modules.
	 * @return {Array}
	 */
	subModules = (function () {
		var cache = null;

		return function () {
			if (!cache) {
				cache = fs.readdirSync('local')
					.filter(function (item) {
						return fs.statSync(path.join('local', item))
							.isDirectory();
					});
			}

			return cache;
		};
	}()),

	/**
	 * Generate building option for each sub module.
	 * @return {Array}
	 */
	task = function () {
		return subModules().map(function (name) {
			var modInfo = pkg(),
				options = {
					baseModInfo: modInfo,
					src: path.join('local', name),
					to: path.join('sea-modules/local', name, version(name))
				};

			modInfo.name = name;
			modInfo.output = output(name);
			modInfo.root = 'local';
			modInfo.version = version(name);

			return options;
		});
	},

	/**
	 * Calculate the version number of a sub module.
	 * @param pathname {string}
	 * @return {string}
	 */
	version = (function () {
		var cache = {};

		return function (name) {
			if (!cache[name]) {
				var contents = [];

				(function travel(pathname) {
					fs.readdirSync(pathname)
						.forEach(function (item) {
							item = path.join(pathname, item);

							var stats = fs.statSync(item);

							if (stats.isFile() && path.extname(item) === '.js') {
								contents.push(fs.readFileSync(item, 'utf8'));
							} else if (stats.isDirectory()) {
								travel(item);
							}
						});
				}(path.join('local', name)));

				cache[name] = util.crc32(contents.join(''));
			}

			return cache[name];
		};
	}()),

	DUMMY;

module.exports = run;
