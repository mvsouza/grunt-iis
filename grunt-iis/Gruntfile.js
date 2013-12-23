/*
 * grunt-iis
 * https://github.com/Integrify/node-iis
 *
 * Copyright (c) 2013 Eduardo Pacheco
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    iis: {
		NewSite: {
			path : 'NewSite',
			physicalPath : __dirname
		}
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // test
  grunt.registerTask('test', ['iis']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);

};
