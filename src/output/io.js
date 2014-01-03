var IO = require('fantasy-io'),
    State = require('fantasy-states'),
    Option = require('fantasy-options'),
    
    combinators = require('fantasy-combinators'),
    tuples = require('fantasy-tuples'),
    lenses = require('fantasy-lenses'),

    compose = combinators.compose,
    constant = combinators.constant,

    Lens = lenses.Lens,
    Tuple2 = tuples.Tuple2,

    defaultTag = IO.of('<{{name}}{{attr}}>{{children}}</{{name}}>'),

    htmlIdentifiers = {
        'className': 'class'
    },
    ignoreIdentifiers = {
        'data-node-name': Option.None,
        'data-node-value': Option.None
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
            return a.fold(function(x) {
                return x.cata({
                    Node: function(a, b) {
                        return Tuple2(a, b);
                    }
                });
            });
        };
    },
    extractName = function(n) {
        return function(a) {
            return function(b) {
                return Tuple2(
                    a,
                    n.get('data-node-name').fold(
                        function(x) {
                            return x.get();
                        },
                        constant('x-invalid-tag-name')
                    )
                );
            };
        };
    },
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
            var lens = Lens.objectLens('_2').run(a),
                val = lens.get(),
                pad = val.length > 1 ? ' ' + val : val;

            return lens.set(pad);
        };
    },
    // Flatten
    flattenChildren = function(a) {
        var parent = a._1;
        var M = State.StateT(IO),
            rec = function(x) {
                return function(a, b) {
                    return a
                        .chain(constant(M.lift(b)))
                        .chain(compose(M.modify)(function(a) {
                            return function(b) {
                                return Tuple2(a._1, b._1 + a._2);
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
    replaceName = replace(/{{name}}/g),
    replaceAttribute = replace(/{{attr}}/g),
    // Tag
    tag = function(a) {
        return function(b) {
            var aa = a;
            var M = State.StateT(IO),

                program = M.lift(defaultTag)
                .chain(compose(M.modify)(extractName(a._1)))
                .chain(compose(M.modify)(replaceName))
                .chain(constant(M.get))
                .chain(compose(M.modify)(extractAttributes(a._1)))
                .chain(compose(M.modify)(padAttributes))
                .chain(compose(M.modify)(replaceAttribute))
                .chain(constant(M.get))
                .chain(compose(M.modify)(extractChildren(a._2)))
                .chain(constant(M.get))
                .chain(function(a) {
                    return M.modify(function(b) {
                        var flattened = flattenChildren(a)(b);
                        return Tuple2(b._1, flattened.exec(Tuple2('', '')));
                    });
                })
                .chain(constant(M.get))
                .chain(function(a) {
                    return M.lift(a._2);
                })
                .chain(compose(M.modify)(function(a) {
                    return function(b) {
                        // FIND UNDEFINED ORIGIN
                        var result = b._1;
                        if (typeof a._2 != 'undefined') {
                            result = b._1.replace(/{{children}}/g, a._2);
                        }
                        return Tuple2(result, b._1);
                    };
                }))
                .chain(constant(M.get));

            return program;
        };
    };

function output(root) {
    var M = State.StateT(IO),

        program = M.lift(IO.of(root))
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
}

// Export
if(typeof module != 'undefined')
    module.exports = output;