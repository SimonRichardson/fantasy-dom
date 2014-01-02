var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,

    dom = require('./../fantasy-dom'),
    Attr = dom.Attr,

    functor = laws.functor,
    monad = laws.monad,

    identity = λ.identity;

exports.attr = {
    // Functor tests
    'All (Functor)': functor.laws(λ)(Attr.of, identity),
    'Identity (Functor)': functor.identity(λ)(Attr.of, identity),
    'Composition (Functor)': functor.composition(λ)(Attr.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Attr, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Attr, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Attr, identity),
    'Associativity (Monad)': monad.associativity(λ)(Attr, identity)
};