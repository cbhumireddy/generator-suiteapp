/**
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 *
 * PSG SuiteSuccess Helper Module for Running Jasmine Tests in Karma, Wallaby & SSTFv2.
 *
 * @Version 1.00.1
 * @NModuleScope Public
 */
define([
    'N/search',
    'N/file',
    'N/runtime'
], function (
    search,
    file,
    runtime
) {
    /** Start of Configuration **/
    // SuiteApp ID
    var appid = '<%= projectname %>';
    // The file that represents that the SuiteApp is installed.
    var installedFile = appid + '.installed';
    // The path of the folder where installedFile is located. Relative to FileCabinet/SuiteApps/<appid>/.
    var installedFileFolder = 'src/common/resources/';
    // The path of the folder where stubs for N files are located. Relative to FileCabinet/SuiteApps/<appid>/.
    // Make sure that 'search', 'file', and 'runtime' are present in this folder (required by this module).
    var nStubsFolder = 'test/jasmine/unit/mock/N';
    // Default offline runner is Karma, only set this to true if you use Wallaby.
    var useWallaby = false;
    /** End of Configuration **/

    var isLocalRun = true; // dynamically set
    var baseUrl = null; // dynamically set

    function getEnvironmentForJasmine() {
        // Make sure that runtime.accountId is falsy in your '<nStubsFolder>/runtime' file
        var requireToUse = runtime.accountId ? _setupNsRequire() : _setupOfflineRequire();

        return {
            isLocalRun: isLocalRun,
            requireBaseUrl: baseUrl,
            require: requireToUse
        }
    }

    function _setupNsRequire() {
        baseUrl = _getBaseUrlInAccount({
            'N/search': search,
            'N/file': file
        }, installedFile);
        var scopedRequire = require.config({
            paths: {
                N: baseUrl + '/' + nStubsFolder
            },
            context: 'sstf'
        });
        isLocalRun = false;

        return scopedRequire;

        function _getBaseUrlInAccount(nsDependencies, installedFile) {
            var nsSearch = nsDependencies['N/search'];
            var fileRec = nsDependencies['N/file'].load({
                id: _getInternalIdOfFilename(installedFile)
            });

            return _constructFullPath();

            function _getInternalIdOfFilename(filename) {
                var page = _findFileByNameThenReturnFirstOnly(filename);

                var fileObj = {};
                page.data.forEach(function (res) {
                    fileObj = {
                        name: res.getValue({name: 'name'}),
                        id: res.id
                    };
                });

                return fileObj.id;
            }

            function _findFileByNameThenReturnFirstOnly(filename) {
                var pagedData = nsSearch.create({
                    type: 'file',
                    columns: [
                        {name: 'name'},
                        {name: 'internalid'}
                    ],
                    filters: [
                        ['name', 'is', filename]
                    ]
                }).runPaged({pageSize: 5}); // set to minimum

                var fetched = null;
                try {
                    fetched = pagedData.fetch({index: 0});
                } catch (e) {
                    throw 'installedFile is missing.';
                }

                return fetched;
            }

            function _constructFullPath() {
                return '/' + fileRec.path.replace('/' + installedFileFolder + installedFile, '');
            }
        }
    }

    function _setupOfflineRequire() {
        // Not sure why Karma added 'base' in the root directory, Wallaby's path makes more sense...
        baseUrl = (useWallaby ? 'FileCabinet/SuiteApps/' : 'base/FileCabinet/SuiteApps/') + appid;
        require.config({
            paths: {
                N: baseUrl + '/' + nStubsFolder
            }
        });

        return require;
    }

    return {
        getEnvironmentForJasmine: getEnvironmentForJasmine
    };
});