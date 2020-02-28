/**
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 *
 * PSG SuiteSuccess Karma Configuration
 *
 * @Version 1.00.0
 *
 * Make sure that the following npm modules are installed globally
 * - TODO: check Confluence page
 *
 * Find and update all "Start/End of Configuration" sections.
 *
 */

/** Start of Configuration **/
// SuiteApp ID
var appid = '<%= projectname %>';

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],

        /** Start of Configuration **/
        // list of files / patterns to load in the browser
        files: [
            'FileCabinet/SuiteApps/' + appid + '/test/unit/jasmine/vendor/require.js',
            {
                pattern: 'FileCabinet/SuiteApps/' + appid + '/test/unit/jasmine/mock/**/*.js',
                included: false
            },
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/src/**/*.js', included: false},
            {
                pattern: 'FileCabinet/SuiteApps/' + appid + '/test/unit/jasmine/**/*Spec.js',
                included: false
            },
            'FileCabinet/SuiteApps/' + appid + '/test/unit/jasmine/test-main.karma.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'FileCabinet/SuiteApps/<%= projectname %>;/src/**/*.js': ['coverage']
        },
        /** End of Configuration **/

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter

        reporters: ['progress', 'coverage'],

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            subdir: 'html',
            includeAllSources: true,
            dir: 'coverage/'
        },

        progressReporter: {
            maxLogLines: 5, // limit number of lines logged per test
            suppressErrorSummary: false, // do not print error summary
            suppressFailed: false, // do not print information about failed tests
            suppressPassed: false, // do not print information about passed tests
            suppressSkipped: true, // do not print information about skipped tests
            showSpecTiming: false // print the time elapsed for each spec
        },
        // Optionally, configure the reporter
        // htmlDetailed : {
        //     dir : 'unit_test_report/',
        //     splitResults: true
        // },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
