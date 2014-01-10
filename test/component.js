var λ = require('./lib/test'),
    IO = require('fantasy-io'),
    Seq = require('fantasy-seqs').Seq,
    
    mock = require('./lib/dom'),
    dom = require('./../fantasy-dom'),
    names = require('./../src/names'),

    laws = require('fantasy-check').laws,

    functor = laws.functor,
    monad = laws.monad,

    Attr = dom.Attr,
    Component = dom.Component,
    DOM = dom.DOM,

    constant = λ.constant,
    identity = λ.identity,

    scaffoldOutput = function(ident, name) {
        var body = mock.createElement('body'),
            h1 = mock.createElement('h1'),
            h1Text = mock.createTextNode(name);

        h1.setAttribute(names.ident, ident);

        body.appendChild(h1);
        h1.appendChild(h1Text);

        return body;
    };

λ.goal = 1;

exports.component = {

    // Functor tests
    'All (Functor)': functor.laws(λ)(Component.of, identity),
    'Identity (Functor)': functor.identity(λ)(Component.of, identity),
    'Composition (Functor)': functor.composition(λ)(Component.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Component, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Component, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Component, identity),
    'Associativity (Monad)': monad.associativity(λ)(Component, identity),

    // Common
    'when testing component append create state affect': λ.check(
        function(x, y) {
            var a = mock.createElement('body'),

                b = Attr.withIdent(x).add(names.nodeValue, y),
                c = DOM.h1(b, Seq.empty()),
                d = Component.of(c).append(IO.of(a)),

                e = scaffoldOutput(x, y);

            d.unsafePerform();

            return λ.deepEquals(a, e);
        },
        [String, String]
    ),
    'when testing component attach': λ.check(
        function(x, y, z) {
            var a = mock.createElement('body'),

                b = Attr.withIdent(x).add(names.nodeValue, y),
                c = DOM.h1(b, Seq.empty()),
                comp = Component.of(c);

            comp.append(IO.of(a)).unsafePerform();
            comp.attach(IO.of(a))({
                custom: function(comp, event) {
                    return comp.map(function(x) {
                        return x.map(function(y) {
                            return y.update(names.nodeValue, z);
                        });
                    });
                }
            }).unsafePerform();

            // Mock the dispatching of events.
            a.dispatchEvent({type:'custom', target:{id:x}});

            return true;
        },
        [String, String, String]
    )
};