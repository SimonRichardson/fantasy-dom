var λ = require('../lib/test'),
    laws = require('fantasy-check').laws,
    Seq = require('fantasy-seqs').Seq,

    dom = require('../../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM,
    Output = dom.Output,

    functor = laws.functor,
    monad = laws.monad,

    identity = λ.identity,

    scaffold = function(title) {
        return DOM.html(
                Attr.empty(),
                Seq.fromArray([
                    DOM.head(
                        Attr.empty(),
                        Seq.of(
                            DOM.title(title)
                        )
                    ),
                    DOM.body(
                        Attr.of({className: 'body'}),
                        Seq.fromArray([
                            DOM.h1(
                                Attr.withValue(title),
                                Seq.empty()
                            ),
                            DOM.div(
                                Attr.withValue(title),
                                Seq.empty()
                            )
                        ])
                    )
                ])
            );
    },
    scaffoldOutput = function(title) {
        return '<html><head><title>' +
                title +
                '</title></head><body class="body"><h1>' +
                title +
                '</h1><div>' +
                title +
                '</div></body></html>';
    };

exports.string = {
    'when testing scaffolding output should return correct value': λ.check(
        function(a) {
            return Output.string(scaffold(a)).unsafePerform() === scaffoldOutput(a);
        },
        [String]
    )
};