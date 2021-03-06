var env = require('fantasy-environment'),
    Attr = require('./src/attr'),
    Component = require('./src/component'),
    DOM = require('./src/dom'),
    names = require('./src/names'),

    Output = env()
        .property('dom', require('./src/output/dom'))
        .property('stringIO', require('./src/output/string-io'))
        .property('string', require('./src/output/string')),
    Selectors = env()
        .property('getByIdent', require('./src/selectors/get-by-ident'))
        .property('getByTagName', require('./src/selectors/get-by-tag-name'))
        .property('query', require('./src/selectors/query')),
    λ = env()
        .property('Attr', Attr)
        .property('Component', Component)
        .property('DOM', DOM)
        .property('names', names)
        .property('Output', Output)
        .property('Selectors', Selectors);

if (typeof module != 'undefined')
    module.exports = λ;