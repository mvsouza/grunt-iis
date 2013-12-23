/*
 * grunt-iis
 * https://github.com/Integrify/node-iis
 *
 * Copyright (c) 2013 Eduardo Pacheco
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var path = require('path');
	var xml2js = require('xml2js');
	var _ = require('underscore');
	var shell = require('shelljs');
	
	var appcmd = '%windir%\\system32\\inetsrv\\appcmd.exe';

	var exec = function(cmd, cb) {
		var output = shell.exec(cmd, { silent : true }).output;
		if (cb) {
			cb(output);
		}
	};
	
	var App = {
		create: {
			pool: function(options, cb) {
				App.get('apppool', 'APPPOOL.NAME', options.pool, function(pool) {
					if ( ! pool) {
						var cmd = appcmd + ' add apppool /name:"' + options.pool + '" /managedRuntimeVersion:"' + options.managedRuntimeVersion + '"';
						exec(cmd, function(output) {
							if (cb) {
								App.get('apppool', 'APPPOOL.NAME', options.pool, function(pool) {
									pool.created = true;
									cb(pool);
								});
							}
						});
					} else {
						if (cb) {
							cb(pool);
						}
					}
				});
			},
			app: function(options, cb) {
				App.get('app', 'path', options.path, function(app) {
					if ( ! app) {
						var cmd = appcmd + ' add app /site.name:"' + options.site + '" /path:"/' + options.path + '/" /physicalPath:"' + options.physicalPath + '" /applicationPool:"' + options.pool + '"';
						exec(cmd, function(output) {
							if (cb) {
								App.get('app', 'path', options.path, function(app) {
									app.created = true;
									cb(app);
								});
							}
						});
					} else {
						App.update.vdir(app, options, function(app) {
							if (cb) {
								cb(app);
							}
						});
					}
				});
			}
		},
		update: {
			vdir: function(app, options, cb) {
				var cmd = appcmd + ' set vdir "' + options.site + '/' + options.path + '/" -physicalPath:"' + options.physicalPath + '"';
				exec(cmd, function(output) {
					if (cb) {
						App.get('app', 'path', options.path, function(app) {
							app.vdir_updated = true;
							cb(app);
						});
					}
				});
			}
		},
		get: function(type, key, value, cb) {
			App.list(type, function(err, res) {
				var match = null;
				if ( ! err) {
					match = _.find(res,function(v) {
						var m = v[key];
						return m && m.replace('/', '').toLowerCase() === value.toLowerCase();
					});
				}
				cb(match);
			});
		},
		list: function(type, cb) {
			var parser = new xml2js.Parser();
			exec(appcmd + ' list ' + type + ' /xml', function(outxml) {
				parser.parseString(outxml, function(err,result) {
				
					var mapped = _.isArray(result[type.toUpperCase()]) ? _.map(result[type.toUpperCase()], function(v) {
						return v['@'];
					}) : [result[type.toUpperCase()]['@']];
					
					if (cb) {
						cb(err, mapped);
					}
				});
			});
		}
	};
	
	grunt.registerMultiTask('iis', 'IIS Environment Installer for grunt', function() {

		var options = {};
		options.site = this.data.site || 'Default Web Site';
		options.path = this.data.path || 'NewSite';
		options.pool = this.data.pool || options.path.replace(/\//g, "_");
		options.managedRuntimeVersion = this.data.managedRuntimeVersion || 'v4.0';
		options.physicalPath = this.data.physicalPath || path.dirname(__dirname);

		App.create.pool(options, function(pool) {
			if (pool.created) {
				console.info('Apppool created.');
			} else {
				console.info('Apppool already exists.');
			}
			App.create.app(options, function(app) {
				if (app.created) {
					console.info('App created.');
				} else {
					console.info('App already exists.');
				}
			});
		});
	});

};
