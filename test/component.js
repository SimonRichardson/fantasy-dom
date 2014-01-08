var λ = require('./lib/test'),
    IO = require('fantasy-io'),
    Seq = require('fantasy-seqs').Seq,

    mock = require('./lib/dom'),
    dom = require('./../fantasy-dom'),
    names = require('./../src/names'),
    tuples = require('fantasy-tuples'),

    Attr = dom.Attr,
    Component = dom.Component,
    DOM = dom.DOM,

    Tuple2 = tuples.Tuple2;

exports.component = {
    'when testing component append create state affect': λ.check(
        function(x, y) {
            var a = Attr.withIdent(x).add(names.nodeValue, x),
                b = DOM.h1(a, Seq.empty()),
                c = Component.of(b).append(IO(function() {
                    return mock.body;
                }));

            console.log(c.unsafePerform());

            return true;
        },
        [String]
    )
};