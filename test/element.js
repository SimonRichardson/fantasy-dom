var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,

    Element = require('./../src/element'),

    functor = laws.functor,
    monad = laws.monad,

    identity = λ.identity;

exports.element = {
    // Functor tests
    'All (Functor)': functor.laws(λ)(Element.of, identity),
    'Identity (Functor)': functor.identity(λ)(Element.of, identity),
    'Composition (Functor)': functor.composition(λ)(Element.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Element, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Element, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Element, identity),
    'Associativity (Monad)': monad.associativity(λ)(Element, identity)
};