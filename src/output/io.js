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

    defaultTag = IO.of('<{{name}}{{attr}}>{{value}}{{children}}</{{name}}>'),

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

    str = function(x) {
        return '' + x;
    },
    trimRight = function(x) {
        return x.substr(-1) === ' ' ? trimRight(x.substr(0, x.length - 1)) : x;
    },
    identifierName = function(x) {
        return x in htmlIdentifiers ? htmlIdentifiers[x] : x;
    },
    ignoreIdentifier = function (x) {
        return x in ignoreIdentifiers ? ignoreIdentifiers[x] : Option.Some(x);
    },
    serialiseAttributes = function(a) {
        return a.fold(function(o) {
            return trimRight(
                Object.keys(o).map(
                    function(x) {
                        return ignoreIdentifier(x).fold(
                            function(x) {
                                var z = identifierName(x);
                                return o[x] ? z + '="' + o[x] + '" ' : str(x);
                            },
                            constant('')
                        );
                    }
                ).join('')
            );
        });
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
    extractValue = extractAttribute(names.nodeValue, constant('')),
    extractAttributes = function(n) {
        return function(a) {
            return function(b) {
                return Tuple2(
                    a,
                    serialiseAttributes(n)
                );
            };
        };
    },
    extractChildren = function(x) {
        return function(a) {
            return function(b) {
                return Tuple2(
                    b,
                    x.map(output)
                );
            };
        };
    },
    // Pad
    padAttributes = function() {
        return function(a) {
            // We have to pad for the attributes
            var lens = Lenses._2.run(a),
                val = lens.get(),
                pad = val.length > 1 ? ' ' + val : val;

            return lens.set(pad);
        };
    },
    // Flatten
    flattenChildren = function(a) {
        var rec = function(x) {
                return function(a, b) {
                    return a
                        .chain(constant(M.lift(b)))
                        .chain(compose(M.modify)(function(a) {
                            return function(b) {
                                var lens = Lenses._2.run(a);
                                return lens.set(b._1 + lens.get());
                            };
                        }))
                        .chain(constant(M.get));
                };
            };
        return function(a) {
            return a._2.fold(M.of(''), rec(a));
        };
    },
    // Replacement
    replace = function(name) {
        return function(a) {
            return function(b) {
                return b._1.replace(name, b._2);
            };
        };
    },
    replaceChild = function(name) {
        return function(a) {
            return function(b) {
                var result = b._1.replace(name, a._2);
                return Tuple2(result, result);
            };
        };
    },
    replaceName = replace(/{{name}}/g),
    replaceAttribute = replace(/{{attr}}/),
    replaceValue = replace(/{{value}}/),
    replaceChildren = replaceChild(/{{children}}/),
    // Tag
    tag = function(a) {
        return function(b) {
            var program = M.lift(defaultTag)
                .chain(compose(M.modify)(extractName(a._1)))
                .chain(compose(M.modify)(replaceName))
                .chain(constant(M.get))
                .chain(compose(M.modify)(extractAttributes(a._1)))
                .chain(compose(M.modify)(padAttributes))
                .chain(compose(M.modify)(replaceAttribute))
                .chain(constant(M.get))
                .chain(compose(M.modify)(extractValue(a._1)))
                .chain(compose(M.modify)(replaceValue))
                .chain(constant(M.get))
                .chain(compose(M.modify)(extractChildren(a._2)))
                .chain(constant(M.get))
                .chain(function(a) {
                    return M.modify(function(b) {
                        var flattened = flattenChildren(a)(b),
                            lens = Lenses._2.run(b);
                        return lens.set(flattened.exec(Tuple2('', '')));
                    });
                })
                .chain(constant(M.get))
                .chain(function(a) {
                    return M.lift(a._2);
                })
                .chain(compose(M.modify)(replaceChildren))
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
                    return tag(a)(b).exec('');
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