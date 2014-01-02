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
                            DOM.title(
                                Attr.empty(),
                                Seq.fromArray([
                                    DOM.text(title)
                                ])
                            )
                        )
                    ),
                    DOM.body(
                        Attr.of({className: 'body'}),
                        Seq.empty()
                    )
                ])
            );
    },
    scaffoldOutput = function(title) {
        return '<html><head><title>' +
                title +
                '</title></head><body class="body"></body></html>';
    };

exports.string = {
    'when testing scaffolding output should return correct value': λ.check(
        function(a) {
            return Output.string(scaffold(a)) === scaffoldOutput(a);
        },
        [String]
    )
};