var λ = require('./../lib/test'),
    laws = require('fantasy-check').laws,
    Seq = require('fantasy-seqs').Seq,

    Stream = require('./../../src/events/stream'),

    applicative = laws.applicative,
    functor = laws.functor,
    monad = laws.monad,

    constant = λ.constant,
    extend = λ.extend,
    identity = λ.identity;

function run(a) {
    return [a.fork(identity)];
}

exports.stream = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(Stream, run),
    'Identity (Applicative)': applicative.identity(λ)(Stream, run),
    'Composition (Applicative)': applicative.composition(λ)(Stream, run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Stream, run),
    'Interchange (Applicative)': applicative.interchange(λ)(Stream, run),
    
    // Functor tests
    'All (Functor)': functor.laws(λ)(Stream.of, run),
    'Identity (Functor)': functor.identity(λ)(Stream.of, run),
    'Composition (Functor)': functor.composition(λ)(Stream.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Stream, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Stream, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Stream, run),
    'Associativity (Monad)': monad.associativity(λ)(Stream, run)
};