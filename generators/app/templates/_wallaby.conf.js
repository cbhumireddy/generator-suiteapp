var appid = '<%= projectname %>';

module.exports = function () {
    return {
        files: [
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/vendor/require.js', instrument: false},
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/src/**/*.js', load: false},
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/src/common/resources/**/*.js', instrument: false, load: false},
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/mock/**/*.js', instrument: false, load: false},
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/test-main.wallaby.js', instrument: false}
        ],

        tests: [
            {pattern: 'FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/**/*Spec.js', load: false}
        ],

        filesWithNoCoverageCalculated: [
            'FileCabinet/SuiteApps/' + appid + '/src/BundleInstaller/main/NFPF_BI_Setup.js'
        ],

        testFramework: 'jasmine'
    };
};