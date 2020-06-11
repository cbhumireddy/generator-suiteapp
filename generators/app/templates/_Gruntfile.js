/**
 Copyright (c) 2015, 2017, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

// START: CONFIGURATION
var sourceDir = 'FileCabinet/SuiteApps/<%= projectname %>/src/';
var availableViews = {
    'jet/Splitview': {
        destination: sourceDir + 'ShipmentRecord/ui/view/'
    }
};
var cssDir = 'common/resources/css/';
// END: CONFIGURATION

var buildOutputDir = 'JET/suiteapp/';
var jetIndexDir = 'JET/src/';
var jetMainJsDir = 'JET/src/js/';
var jetWebCss = 'JET/web/css';
var cssDest = sourceDir + cssDir;
// The section that gets replaced with the actual view to build in oraclejet-build.js.
var defaultReplacementString =
    '//inject:viewName\n' + "var viewName = '[Insert View Name Here]';\n" + '//endinject:viewName';

// This will update the timestamp of the minified file with latest value
var cacheBustReplacementString = 'var cacheBustId = ' + new Date().getTime() + ';';
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        clean: {
            all: [buildOutputDir]
        },
        watch: {
            mainIndex: {}
        },
        exec: {
            unlock_files_restore: {
                cmd: 'attrib -R JET/oraclejetconfig.json'
            },
            unlock_files_serve: {
                cmd: '' + 'attrib -R JET/src/js/main.js && ' + 'attrib -R JET/src/index.html'
            },
            unlock_files_build: {
                cmd: 'attrib -R JET/scripts/config/oraclejet-build.js'
            },
            unlock_theme_build: {
                cmd: ''
            },
            unlock_files_suiteapp: {
                cmd: '' // set in 'grunt build'
            },
            ojet_build: {
                cmd: 'cd JET && ojet build --release'
            },
            ojet_build_theme: {},
            ojet_serve: {
                cmd: 'cd JET && ojet serve'
            },
            ojet_serve_theme: {
                cmd: ''
            },
            ojet_restore: {
                cmd: 'cd JET && ojet restore'
            },
            mockserver: {
                cmd: 'cd JET && mockserver -p 8080 -m mocks'
            }
        },
        copy: {
            index: {},
            main: {},
            build: {},
            theme: {}
        },
        'string-replace': {
            config: {
                files: [
                    {
                        expand: true,
                        cwd: 'JET/scripts/config/',
                        src: ['oraclejet-build.js'],
                        dest: 'JET/scripts/config/'
                    }
                ],
                options: {
                    replacements: [
                        {
                            pattern: /\/\/inject:viewName[\s\S]*\/\/endinject:viewName/m,
                            replacement: defaultReplacementString
                        },
                        {
                            pattern: /var cacheBustId = (.*?);/m,
                            replacement: cacheBustReplacementString
                        }
                    ]
                }
            }
        }
    });

    function _validateParameters(viewName) {
        if (!viewName) grunt.fail.fatal('Missing parameter: "--view"', 3);

        if (Object.keys(availableViews).indexOf(viewName) === -1)
            grunt.fail.fatal('Invalid value for "--view". Refer to "availableViews" variable.', 3);
    }

    function _updateBuildConfig(viewName) {
        grunt.task.run([
            'exec:unlock_files_build'
        ]);
        grunt.config('string-replace.config.options.replacements', [
            {
                pattern: /\/\/inject:viewName[\s\S]*\/\/endinject:viewName/m,
                replacement:
                    '//inject:viewName\n' +
                    "var viewName = '" +
                    viewName +
                    "';\n" +
                    '//endinject:viewName'
            }
        ]);
        grunt.task.run(['string-replace']);
    }

    function _runBuild() {
        grunt.task.run(['exec:ojet_build']);
    }

    function _runBuildTheme(theme) {
        var cmd = `cd JET && ojet build --theme=${theme} --release`;
        grunt.config('exec.ojet_build_theme', {
            cmd: cmd
        });
        grunt.task.run(['exec:ojet_build_theme']);
    }

    function _copyViewToSuiteApp(viewName) {
        grunt.config('exec.unlock_files_suiteapp', {
            cmd: 'attrib -R ' + availableViews[viewName].destination + viewName + '.js'
        });
        grunt.config('copy.build', {
            expand: true,
            cwd: buildOutputDir,
            src: [viewName + '.js'],
            dest: availableViews[viewName].destination
        });

        grunt.task.run(['exec:unlock_files_suiteapp', 'copy:build']);
    }

    function _copyThemeCss(theme) {
        var cmd = `attrib -R /s ${cssDest}${theme}/*.*`;
        grunt.config('exec.unlock_theme_build', {
            cmd: cmd
        });
        var themeOp = {
            expand: true,
            cwd: `${jetWebCss}/${theme}/`,
            src: ['**'],
            dest: `${cssDest}${theme}/`
        };
        grunt.log.ok('cmd', cmd);
        grunt.log.ok('op', themeOp);
        grunt.config('copy.theme', themeOp);

        grunt.task.run(['exec:unlock_theme_build', 'copy:theme']);
    }

    function _copyIndexAndMain(viewName) {
        grunt.config('copy.index', {
            src: [jetMainJsDir + viewName + '.html'],
            dest: jetIndexDir + 'index.html'
        });
        grunt.config('copy.main', {
            src: [jetMainJsDir + viewName + 'Main.js'],
            dest: jetMainJsDir + 'main.js'
        });
        grunt.task.run(['exec:unlock_files_serve', 'copy:index', 'copy:main']);
    }

    function _resetCacheId() {
        grunt.log.ok('Resetting the cache Id');
        grunt.task.run([
            'exec:unlock_files_build'
        ]);
        grunt.config('string-replace.config.options.replacements', [
            {
                pattern: /var cacheBustId = (.*?);/m,
                replacement: cacheBustReplacementString
            }
        ]);
        grunt.task.run(['string-replace']);
    }

    grunt.registerTask('build', function(view) {
        var viewName = grunt.option('view');
        var theme = grunt.option('theme');
        _validateParameters(viewName);
        _copyIndexAndMain(viewName);
        _updateBuildConfig(viewName);
        if (theme) {
            _runBuildTheme(theme);
            _copyThemeCss(theme);
        } else {
            _runBuild();
        }

        _copyViewToSuiteApp(viewName);
        // _resetBuildConfig(); // TODO: not sure why this is run even when _runBuild is not yet finished
    });

    grunt.registerTask('serve', function() {
        var viewName = grunt.option('view');
        var theme = grunt.option('theme');
        _validateParameters(viewName);
        _copyIndexAndMain(viewName);
        if (theme) {
            var cmd = `cd JET && ojet serve --theme=${theme}`;
            grunt.config('exec.ojet_serve_theme', {
                cmd: cmd
            });
            grunt.task.run(['exec:ojet_serve_theme']);
        } else {
            grunt.task.run(['exec:ojet_serve']);
        }
    });

    grunt.registerTask('restore', function() {
        grunt.task.run(['exec:unlock_files_restore', 'exec:ojet_restore']);
    });

    grunt.registerTask('theme', function() {
        var theme = grunt.option('theme');
        _copyThemeCss(theme);
    });

    grunt.registerTask('cacheBust', function() {
        _resetCacheId();
    });

    grunt.registerTask('copyIndexAndMain', function() {
        var viewName = grunt.option('view');
        _validateParameters(viewName);
        _copyIndexAndMain(viewName);
    });

    grunt.registerTask('watchMain', function() {
        var viewName = grunt.option('view');
        var viewHtml = `${jetMainJsDir}${viewName}.html`;
        var mainJs = `${jetMainJsDir}${viewName}Main.js`;

        grunt.config('watch.mainIndex', {
            files: [viewHtml, mainJs],
            tasks: ['copyIndexAndMain']
        });

        grunt.task.run(['watch:mainIndex']);
    });

    grunt.registerTask('updateindex', function() {
        var viewName = grunt.option('view');

        _validateParameters(viewName);
        grunt.config('copy.index', {
            src: [jetMainJsDir + viewName + '.html'],
            dest: jetIndexDir + 'index.html'
        });
        grunt.task.run(['exec:unlock_files_serve', 'copy:index']);
    });

    grunt.registerTask('runmocks', function() {
        grunt.task.run(['exec:mockserver']);
    });
};
