var IO = require('fantasy-io'),
    State = require('fantasy-states'),
    Option = require('fantasy-options'),
    
    combinators = require('fantasy-combinators'),
    helpers = require('fantasy-helpers'),
    tuples = require('fantasy-tuples'),
    lenses = require('fantasy-lenses'),
    names = require('../names'),

    extend = helpers.extend,
    singleton = helpers.singleton,

    compose = combinators.compose,
    constant = combinators.constant,

    Lens = lenses.Lens,
    Tuple2 = tuples.Tuple2,

    defaultTag = IO(function() {
        return window.createElement;
    }),

    htmlIdentifiers = {
        'className': 'class'
    },
    ignoreIdentifiers = extend(
        singleton(names.nodeName, Option.None),
        singleton(names.nodeValue, Option.None)
    ),

    M = State.StateT(IO),
    Lenses = {
        _1: Lens.objectLens('_1'),
        _2: Lens.objectLens('_2')
    },

    identifierName = function(x) {
        return x in htmlIdentifiers ? htmlIdentifiers[x] : x;
    },
    ignoreIdentifier = function (x) {
        return x in ignoreIdentifiers ? ignoreIdentifiers[x] : Option.Some(x);
    },
    // Extraction
    extract = function() {
        return function(a) {
            return a.cata({
                Node: function(a, b) {
                    return Tuple2(a, b);
                }
            });
        };
    },
    extractAttribute = function(x, y) {
        return function(n) {
            return function(a) {
                return function(b) {
                    return Tuple2(
                        a,
                        n.get(x).fold(
                            function(x) {
                                return x.get();
                            },
                            y
                        )
                    );
                };
            };
        };
    },
    extractName = extractAttribute(names.nodeName, function() {
        throw new TypeError('Unexpected TagName: name unknown.');
    }),
    // Creation
    createWithName = function(a) {
        return function(b) {
            return b(a);
        };
    },
    // Tag
    tag = function(a) {
        return function(b) {
            var program = M.lift(defaultTag)
                .chain(compose(M.modify)(extractName(a._1)))
                .chain(compose(M.modify)(createWithName))
                .chain(constant(M.get));

            return program;
        };
    },
    output = function(root) {
        var program = M.lift(IO.of(root))
            .chain(compose(M.modify)(constant))
            .chain(compose(M.modify)(extract))
            .chain(constant(M.get))
            .chain(function(a) {
                return M.modify(function(b) {
                    return tag(a)(b).exec();
                });
            })
            .chain(constant(M.get))
            .chain(function(a) {
                return M.lift(a);
            })
            .chain(compose(M.modify)(constant))
            .chain(constant(M.get));

        return program.exec('');
    };

function main(root) {
    return M.lift(output(root))
        .chain(compose(M.modify)(function(a) {
            return function(b) {
                return a._1;
            };
        }))
        .exec('');
}

// Export
if(typeof module != 'undefined')
    module.exports = main;