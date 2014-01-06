var λ = require('./../lib/test'),
    seqs = require('fantasy-seqs'),
    dom = require('./../../fantasy-dom'),
    Tree = require('./../../src/tree'),

    Attr = dom.Attr,
    DOM = dom.DOM,
    names = dom.names,
    Selectors = dom.Selectors,
    Seq = seqs.Seq,

    getByIdent = Selectors.getByIdent,

    constant = λ.constant,
    identity = λ.identity;

exports.getByIdent = {
    'when calling getByIdent should return correct instance': λ.check(
        function(x) {
            var a = Attr.withIdent(x),
                b = a.get(names.ident).x.get(),
                c = DOM.h1(a, Seq.empty());
            return getByIdent(c)(x).x instanceof Tree;
        },
        [λ.AnyVal]
    ),
    'when calling getByIdent with incorrect id should return none': λ.check(
        function(x) {
            var a = Attr.withIdent('ident'),
                b = a.get(names.ident).x.get(),
                c = DOM.h1(a, Seq.empty());
            return getByIdent(c)(x).fold(
                constant(false),
                constant(true)
            );
        },
        [λ.AnyVal]
    )
};