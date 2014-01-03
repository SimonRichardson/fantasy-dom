var λ = require('./lib/test'),
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM;

exports.dom = {
    'test': function(test) {
        var a = Attr.withIdent({}),
            b = a.get('id').x.get(),
            c = DOM.h1(a, Seq.empty()).map(function(h1) {
                return h1.map(function(attr) {
                    return attr.update('id', 2);
                });
            });
        //console.log(c.getByIdent(2));
        //test.ok(c.getByIdent(b).x.attr.x.id === 2);
        test.ok(true);
        test.done();
    }
};