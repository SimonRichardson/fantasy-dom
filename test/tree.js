var λ = require('./lib/test'),
    laws = require('fantasy-check').laws,
    Seq = require('fantasy-seqs').Seq,

    Tree = require('./../src/tree'),

    applicative = laws.applicative,
    functor = laws.functor,
    monad = laws.monad,

    constant = λ.constant,
    identity = λ.identity,

    treeAsString = function(a) {
        var ident = function(i) {
                var accum = '';
                while(--i > -1) {
                    accum += '-';
                }
                return accum;
            },
            rec = function(a, v, i) {
                return a.cata({
                    Node: function(x, y) {
                        var b = v + '\n' + ident(i) + x,
                            c = i + 1;
                        return y.fold(b, function(a, b) {
                            return rec(b, a, c);
                        });
                    }
                });
            };
        return rec(a, '', 0);
    };

exports.tree = {
    
    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(Tree, identity),
    'Identity (Applicative)': applicative.identity(λ)(Tree, identity),
    'Composition (Applicative)': applicative.composition(λ)(Tree, identity),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Tree, identity),
    'Interchange (Applicative)': applicative.interchange(λ)(Tree, identity),

    // Functor tests
    'All (Functor)': functor.laws(λ)(Tree.of, identity),
    'Identity (Functor)': functor.identity(λ)(Tree.of, identity),
    'Composition (Functor)': functor.composition(λ)(Tree.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Tree, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Tree, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Tree, identity),
    'Associativity (Monad)': monad.associativity(λ)(Tree, identity),
    
    // Common
    'when testing add should return correct value': λ.check(
        function(a, b) {
            var x = Tree.of(a).add(Tree.of(b));
            return λ.equals(x.toSeq(), Seq.fromArray([a, b]));
        },
        [λ.AnyVal, λ.AnyVal]
    ),
    'when testing filter should return correct value': λ.check(
        function(a) {
            var x = Tree.of(1).add(
                    Tree.of(2).add(
                        Tree.of(a).add(
                            Tree.of(4)
                        )
                    )
                ).add(
                    Tree.of(5)
                ).add(
                    Tree.of(6)
                ),

                z = Tree.of(1).add(
                    Tree.of(2)
                ).add(
                    Tree.of(5)
                ).add(
                    Tree.of(6)
                ),

                y = x.filter(function(x) {
                    return a !== x;
                });

            return treeAsString(y.x) === treeAsString(z);
        },
        [Number]
    ),
    'when testing find should return correct value': λ.check(
        function(a) {
            var x = Tree.of(1).add(
                    Tree.of(2).add(
                        Tree.of(a).add(
                            Tree.of(4)
                        )
                    )
                ).add(
                    Tree.of(5)
                ).add(
                    Tree.of(6)
                ),

                y = x.find(function(x) {
                    return a === x;
                });

            return y.fold(
                function(b) {
                    return a === b.x;
                },
                constant(false)
            );
        },
        [Number]
    )/*,
    'when testing size should return correct value': λ.check(
        function(a, b) {
            // TODO (Simon) : Implement random tree.
            var x = Tree.of(a).add(Tree.of(b));
            return x.size() === [a, b].length;
        },
        [λ.AnyVal, λ.AnyVal]
    )*/,
    'when testing toSeq should return correct value': λ.check(
        function(a, b) {
            var x = Tree.of(a).add(Tree.of(b));
            return λ.equals(x.toSeq(), Seq.fromArray([a, b]));
        },
        [λ.AnyVal, λ.AnyVal]
    )
};