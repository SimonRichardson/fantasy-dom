var λ = require('./lib/test'),
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM;

exports.dom = {
    'when testing getByIdent returns same element': λ.check(
        function(x, y) {
            var a = Attr.withIdent(x),
                b = a.get('id').x.get(),
                c = DOM.h1(a, Seq.empty()).map(function(h1) {
                    return h1.map(function(attr) {
                        return attr.update('id', y);
                    });
                });
            return c.getByIdent(y).x === c.x;
        },
        [λ.AnyVal, λ.AnyVal]
    )
};