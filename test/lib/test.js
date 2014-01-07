var λ = require('fantasy-check').adapters.nodeunit,
    combinators = require('fantasy-combinators'),
    equals = require('./equality'),

    identity = combinators.identity;

λ = λ
    .property('identity', identity)
    .property('equals', equals.arrayEquals)
    .property('arrayEquals', equals.arrayEquals)
    .property('objectEquals', equals.objectEquals)
    .property('deepEquals', equals.deepEquals);

if (typeof module != 'undefined')
    module.exports = λ;
