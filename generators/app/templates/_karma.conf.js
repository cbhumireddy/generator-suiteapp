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

// default value to use: 'FileCabinet/SuiteApps/' + appid + '/src/**/*.js'
// if there are certain folders to exclude and hard to find the correct pattern, just enumerate the items
// to include here.
var includeInCodeCoverage = [
    'FileCabinet/SuiteApps/' + appid + '/src/**/!(lib)/*.js'
];
/** End of Configuration **/

var preprocessors = {};
includeInCodeCoverage.map(function (key) {
    preprocessors[key] = ['coverage'];
});

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],

        /** Start of Configuration **/
        // list of files / patterns to load in the browser
        files: [
            'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/vendor/require.js',
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/mock/**/*.js', included: false},
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/src/**/!(3rdparty)/*.js', included: false},
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/**/*Spec.js', included: false},
            'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/test-main.karma.js'
        ],

        // list of files to exclude
        exclude: [
            'FileCabinet/SuiteApps/' + appid + '/src/BundleInstaller/main/OG_BI_Setup.js'
        ],

        /** End of Configuration **/

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // (these files will be instrumented by Istanbul)
        preprocessors: preprocessors,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        plugins: [
            'karma-jasmine',
            'karma-requirejs',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-teamcity-reporter'
        ],
        reporters: ['spec', 'coverage', 'progress'],

        specReporter: {
            maxLogLines: 5,         // limit number of lines logged per test
            suppressErrorSummary: true,  // do not print error summary
            suppressFailed: false,  // do not print information about failed tests
            suppressPassed: false,  // do not print information about passed tests
            suppressSkipped: true,  // do not print information about skipped tests
            showSpecTiming: false // print the time elapsed for each spec
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'lcov',
            subdir: 'html',
            includeAllSources: true,
            dir: 'coverage/'
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
        browsers: ['ChromeHeadlessNoSandbox', 'ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};