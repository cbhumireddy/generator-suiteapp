function extractProperty(input) {
    return input !== undefined ? input.toString().split('=').length > 1 ? input.toString().split('=')[1] : input.toString().split('=')[0] : null;
}

module.exports = {
    extractProperty : extractProperty
};

