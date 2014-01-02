var Attr = require('./src/attr'),
    DOM = require('./src/dom'),
    Output = {
        string: require('./src/output/string')
    };

if (typeof module != 'undefined')
    module.exports = {
        Attr: Attr,
        DOM: DOM,
        Output: Output
    };