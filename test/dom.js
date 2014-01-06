var λ = require('./lib/test'),
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    names = require('./../src/names'),

    Attr = dom.Attr,
    DOM = dom.DOM,
    Selectors = dom.Selectors,

    getByIdent = Selectors.getByIdent;

exports.dom = {
    'when testing getByIdent returns same element': λ.check(
        function(x, y) {
            var a = Attr.withIdent(x),
                b = a.get(names.ident).x.get(),
                c = DOM.h1(a, Seq.empty()).map(function(attr) {
                    return attr.update(names.ident, y);
                });
            return getByIdent(c)(y).x.x === c.x;
        },
        [λ.AnyVal, λ.AnyVal]
    )
};