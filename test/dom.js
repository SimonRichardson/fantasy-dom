var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,
    Seq = require('fantasy-seqs').Seq,

    dom = require('./../fantasy-dom'),
    DOM = dom.DOM,
    Output = dom.Output,

    functor = laws.functor,
    monad = laws.monad,

    identity = λ.identity,

    scafold = function(title) {
        return DOM.html(
                {},
                Seq.fromArray([
                    DOM.head(
                        {},
                        Seq.of(
                            DOM.title(
                                {},
                                Seq.fromArray([
                                    DOM.text(title)
                                ])
                            )
                        )
                    ),
                    DOM.body(
                        {},
                        Seq.empty()
                    )
                ])
            );
    };

exports.dom = {
    // Functor tests
    'All (Functor)': functor.laws(λ)(DOM.of, identity),
    'Identity (Functor)': functor.identity(λ)(DOM.of, identity),
    'Composition (Functor)': functor.composition(λ)(DOM.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(DOM, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(DOM, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(DOM, identity),
    'Associativity (Monad)': monad.associativity(λ)(DOM, identity),

    'test': function(test) {
        var a = DOM.h1({uid:1}, Seq.of(DOM.text('Hello World'))).update(function(x) {
                return {uid: x.uid + 1};
            }),
            b = a.cata({
                h1: function(x, y) {
                    return x;
                },
                text: function() {
                    throw new Error('Failed if called');
                }
            });
        console.log(Output.string(scafold('Title')));
        test.ok(b.uid === 2);
        test.done();
    }
};