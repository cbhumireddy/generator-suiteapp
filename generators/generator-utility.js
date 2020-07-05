function extractProperty(input) {
    return input !== undefined ? input.toString().split('=').length > 1 ? input.toString().split('=')[1] : input.toString().split('=')[0] : null;
}

function scriptsDestinationPath(suiteappfoldername, componentname){
    return  componentname ? suiteappfoldername + '/src/FileCabinet/SuiteApps/'+ suiteappfoldername+"/" + componentname :
                            suiteappfoldername ;
}
module.exports = {
    extractProperty : extractProperty,
    scriptsDestinationPath : scriptsDestinationPath
};

