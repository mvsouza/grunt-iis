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
	var last_site;

	var exec = function(cmd, cb) {
		var output = shell.exec(cmd, { silent : true }).output;
		cb(false, output)
	};
	
	var createApp = function(options,cb) {

		options = options || {};
		options.path = options.path || 'NewSite';
		options.name = options.name || "Default Web Site";
		options.appcmd = options.appcmd || appcmd;

		//hold this to be used when creating app folders, etc
		last_site = options.name;

		exists('app',options.path,function(err,tf) {
			if (!tf) {
				var site_cmd = ' add app /site.name:"' + options.name + '" /path:"' + options.path + '"';
				if (options.physicalPath) {
					site_cmd += ' /physicalPath:"' + options.physicalPath + '"';
				}
				exec(appcmd + ' ' + site_cmd, function(err,tf) {
					createAppPool({}, cb);
				});
			}
			else {
				cb(err,'Site ' + options.name + ' exists');
			}
		});
	};

	var createAppPool = function(options,cb) {
		var poolname = typeof(options) == 'string' ? options : options.name;
		var identity = typeof(options) == 'string' ? null : options.identity;
		exists('apppool',poolname,function(err,tf) {
			if (!tf) {
				exec(appcmd + ' add apppool /name:"' + poolname + '"',function(err,stdout) {
					if (cb) {
						cb(err,stdout);
					}
				});
			} else if (cb) {
				cb(null,'App pool ' + poolname + ' exists');
			}
		})
	};

	var list = function(type,cb) {
		var parser = new xml2js.Parser()
		exec(appcmd + ' list ' + type + ' /xml',function(err,outxml) {
			parser.parseString(outxml,function(err,result) {
				//
				//  may return a single object if only 1 site exists
				//
				var mapped = _.isArray(result[type.toUpperCase()]) ? _.map(result[type.toUpperCase()],function(v) {
					return v['@'];
				}) : [result[type.toUpperCase()]['@']];

				if (cb) {
					cb(err,mapped);
				}
				else {
					console.log(mapped);
				}
			});
		});
	};

	var exists = function(type,name,cb) {
		list(type,function(err,res) {
			var match = null;
			if (!err) {
				match = _.find(res,function(v) {
					var m = v[type.toUpperCase() + '.NAME'];
					return m && m.toLowerCase() === name.toLowerCase();
				});
			}
			if (cb) {
				cb(err,match ? true : false);
			}
			else {
				console.log(match);
			}
		});
	};
	
	grunt.registerMultiTask('iis', 'administer iis 7 on windows', function() {
		// init
		var self = this;
		createApp(self.data, function(err, rsp) {
			if ( ! err) {
			   console.log('App '+ self.path +' created.');
			}
		});
	});

};
