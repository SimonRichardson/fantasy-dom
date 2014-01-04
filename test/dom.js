var λ = require('./lib/test'),
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM;

exports.dom = {
    'when testing getByIdent returns same element': λ.check(
        function(x) {
            var a = Attr.withIdent({}),
                b = a.get('id').x.get(),
                c = DOM.h1(a, Seq.empty()).map(function(h1) {
                    return h1.map(function(attr) {
                        return attr.update('id', x);
                    });
                });
            return c.getByIdent(x).x === c.x;
        },
        [λ.AnyVal]
    )
};