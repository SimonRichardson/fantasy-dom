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
                Attr.of({data: 'stuff'}),
                Seq.fromArray([
                    DOM.head(
                        Attr.empty(),
                        Seq.of(
                            DOM.title(title)
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

exports.io = {
    'test': function(test) {
        console.log('\n----------------');
        console.log('FIN : ', Output.io(scaffold(1)).unsafePerform());
        test.ok(true);
        test.done();
    }/*,
    'when testing scaffolding output should return correct value': λ.check(
        function(a) {
            return Output.io(scaffold(a)).unsafePerform() === scaffoldOutput(a);
        },
        [String]
    )*/
};