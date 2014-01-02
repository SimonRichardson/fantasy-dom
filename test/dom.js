var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM,

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
        var a = Attr.withIdent({}),
            b = a.get('id').x.get(),
            c = DOM.h1(a, Seq.empty()).update(function(x) {
                return x.update('id', 2);
            });
        test.ok(c.getByIdent(b).x.attr.x.id === 2);
        test.done();
    }
};