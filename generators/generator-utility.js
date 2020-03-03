function extractProperty(input) {
    return input !== undefined ? input.toString().split('=').length > 1 ? input.toString().split('=')[1] : input.toString().split('=')[0] : null;
}

function scriptsDestinationPath(suiteappfoldername, componentname){
    return  componentname ? suiteappfoldername + '/src/ts/'+ componentname :
                            suiteappfoldername + '/src/';
}
module.exports = {
    extractProperty : extractProperty,
    scriptsDestinationPath : scriptsDestinationPath
};

