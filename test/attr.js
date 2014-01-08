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
    'Associativity (Monad)': monad.associativity(λ)(Attr, identity),

    // Common
    'when adding attribute value': λ.check(
        function(a, b, c) {
            var x = Attr.of(a),
                y = x.add(b, c);
            return y.get(b).x.get() === c;
        },
        [Object, String, λ.AnyVal]
    ),
    'when removing attribute value': λ.check(
        function(a, b, c) {
            var x = Attr.of(λ.singleton(a, b)),
                y = x.remove(a);
            return y.get(a).fold(
                λ.constant(false),
                λ.constant(true)
            );
        },
        [String, λ.AnyVal, λ.AnyVal]
    ),
    'when updating attribute value': λ.check(
        function(a, b, c) {
            var x = Attr.of(λ.singleton(a, b)),
                y = x.update(a, c);
            return y.get(a).x.get() === c;
        },
        [String, λ.AnyVal, λ.AnyVal]
    ),
    'when updating attribute value should not alter old attribute': λ.check(
        function(a, b, c) {
            var x = Attr.of(λ.singleton(a, b)),
                y = x.update(a, c);
            return x.get(a).x.get() === b;
        },
        [String, λ.AnyVal, λ.AnyVal]
    )
};