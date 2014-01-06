var λ = require('./../lib/test'),
    seqs = require('fantasy-seqs'),
    dom = require('./../../fantasy-dom'),
    Tree = require('./../../src/tree'),

    Attr = dom.Attr,
    DOM = dom.DOM,
    names = dom.names,
    Selectors = dom.Selectors,
    Seq = seqs.Seq,

    getByTagName = Selectors.getByTagName,
    
    constant = λ.constant,
    identity = λ.identity;

exports.getByTagName = {
    'when calling getByTagName should return correct instance': λ.check(
        function(x) {
            var a = DOM.x(x)(Attr.empty(), Seq.empty());
            return getByTagName(a)(x).x instanceof Tree;
        },
        [λ.AnyVal]
    ),
    'when calling getByTagName with incorrect name should return zero length': λ.check(
        function(x) {
            var a = DOM.x('name')(Attr.empty(), Seq.empty());
            return getByTagName(a)(x).fold(
                function(x) {
                    return x.size() === 0;
                },
                constant(true)
            );
        },
        [λ.AnyVal]
    )
};