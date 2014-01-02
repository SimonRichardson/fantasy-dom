var λ = require('fantasy-check').adapters.nodeunit,
    combinators = require('fantasy-combinators'),
    equals = require('./equality'),

    identity = combinators.identity;

λ = λ
    .property('identity', identity)
    .property('equals', equals);

if (typeof module != 'undefined')
    module.exports = λ;
