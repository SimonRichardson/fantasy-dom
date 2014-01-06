var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,
    seqs = require('fantasy-seqs'),
    dom = require('./../fantasy-dom'),
    names = require('./../src/names'),
    Element = require('./../src/element'),

    Attr = dom.Attr,
    DOM = dom.DOM,
    Seq = seqs.Seq,

    functor = laws.functor,
    monad = laws.monad,

    constant = λ.constant,
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
    'Associativity (Monad)': monad.associativity(λ)(Element, identity),

    // Common
    'when calling getByIdent should return correct instance': λ.check(
        function(x) {
            var a = Attr.withIdent(x),
                b = a.get(names.ident).x.get(),
                c = DOM.h1(a, Seq.empty());
            return c.getByIdent(x).x instanceof Element;
        },
        [λ.AnyVal]
    ),
    'when calling getByIdent with incorrect id should return none': λ.check(
        function(x) {
            var a = Attr.withIdent('ident'),
                b = a.get(names.ident).x.get(),
                c = DOM.h1(a, Seq.empty());
            return c.getByIdent(x).fold(
                constant(false),
                constant(true)
            );
        },
        [λ.AnyVal]
    ),
    'when calling getByTagName should return correct instance': λ.check(
        function(x) {
            var a = DOM.x(x)(Attr.empty(), Seq.empty());
            return a.getByTagName(x).x instanceof Element;
        },
        [λ.AnyVal]
    ),
    'when calling getByTagName with incorrect name should return zero length': λ.check(
        function(x) {
            var a = DOM.x('name')(Attr.empty(), Seq.empty());
            return a.getByTagName(x).fold(
                function(x) {
                    return x.size() === 0;
                },
                constant(true)
            );
        },
        [λ.AnyVal]
    ),
    'when calling size should return correct value': λ.check(
        function(x) {
            var a = DOM.h1(
                Attr.empty(),
                Seq.fromArray([
                    DOM.x(x)(
                        Attr.empty(),
                        Seq.empty()
                    )
                ])
            );
            return a.size() === 2;
        },
        [λ.AnyVal]
    )
};