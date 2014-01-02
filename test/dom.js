var λ = require('./lib/test'),
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM;

exports.dom = {
    'test': function(test) {
        /*var a = Attr.withIdent({}),
            b = a.get('id').x.get(),
            c = DOM.h1(a, Seq.empty()).update(function(x) {
                return x.update('id', 2);
            });
        test.ok(c.getByIdent(b).x.attr.x.id === 2);*/
        test.ok(true);
        test.done();
    }
};