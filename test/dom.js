var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,

    DOM = require('./../fantasy-dom'),

    functor = laws.functor,
    monad = laws.monad,

    identity = λ.identity;

exports.dom = {
    // Functor tests
    'All (Functor)': functor.laws(λ)(DOM.of, identity),
    'Identity (Functor)': functor.identity(λ)(DOM.of, identity),
    'Composition (Functor)': functor.composition(λ)(DOM.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(DOM, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(DOM, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(DOM, identity),
    'Associativity (Monad)': monad.associativity(λ)(DOM, identity),

    'test': function(test) {
        var a = DOM.h1(1, {}).update(function(x) {
                return x + 1;
            }),
            b = a.cata({
                h1: function(x, y) {
                    return x;
                },
                text: function() {
                    throw new Error('Failed if called');
                }
            });
        test.ok(b === 2);
        test.done();
    }
};