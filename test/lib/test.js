var λ = require('fantasy-check').adapters.nodeunit,
    combinators = require('fantasy-combinators'),

    identity = combinators.identity;

λ = λ
    .property('identity', identity);

if (typeof module != 'undefined')
    module.exports = λ;
