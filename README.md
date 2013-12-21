# grunt-iis

> IIS Environment Installer for grunt based in (https://github.com/Integrify/node-iis.git)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-iis --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-iis');
```

## The "iis" task

### Overview
In your project's Gruntfile, add a section named `iis` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  iis: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

site	'Default Web Site';
path	'NewSite'
pool	'NewSite'
managedRuntimeVersion	'v4.0'
physicalPath

#### options.site
Type: `String`
Default value: `Default Web Site`

A string value of site name.

#### options.path
Type: `String`
Default value: `NewSite`

A string value of url path.

#### options.pool
Type: `String`
Default value: `NewSite`

A string value of poolapp, if null the same of path.

#### options.managedRuntimeVersion
Type: `String`
Default value: `v4.0`

A string value of framework.

#### options.physicalPath
Type: `String`

A string value of full fisical path.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  iis: {
    developer: {
	  physicalPath : __dirname,
      site : 'Default Web Site',
	  path : 'NewSite',
	  pool : 'NewSite',
	  managedRuntimeVersion : 'v4.0'
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
1.0.1 - First version working.
1.0.0 - First version, not working.
