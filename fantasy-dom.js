var env = require('fantasy-environment'),
    Attr = require('./src/attr'),
    DOM = require('./src/dom'),
    names = require('./src/names'),

    Output = env()
        .property('io', require('./src/output/io'))
        .property('string', require('./src/output/string')),
    Selectors = env()
        .property('getByIdent', require('./src/selectors/getByIdent'))
        .property('getByTagName', require('./src/selectors/getByTagName'))
        .property('query', require('./src/selectors/query')),
    λ = env()
        .property('Attr', Attr)
        .property('DOM', DOM)
        .property('names', names)
        .property('Output', Output)
        .property('Selectors', Selectors);

if (typeof module != 'undefined')
    module.exports = λ;