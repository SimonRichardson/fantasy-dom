var DOM = require('./src/dom'),
    Output = {
        string: require('./src/output/string')
    };

if (typeof module != 'undefined')
    module.exports = {
        DOM: DOM,
        Output: Output
    };