var appid = '<%= projectname %>';

var tests = Object.keys(window.__karma__.files).filter(function (file) {
    return /Spec\.js$/.test(file);
});

require.config({
    paths: {
        N: 'base/FileCabinet/SuiteApps/' + appid + '/test/jasmine/unit/mock/N'
    }
});

require(tests, window.__karma__.start);