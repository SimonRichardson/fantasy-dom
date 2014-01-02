var IO = require('fantasy-io'),
    State = require('fantasy-states'),
    Option = require('fantasy-options'),
    
    combinators = require('fantasy-combinators'),
    tuples = require('fantasy-tuples'),

    compose = combinators.compose,
    constant = combinators.constant,

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

    extractName = function(n) {
        return function(a) {
            return function(b) {
                return Tuple2(
                    a,
                    n.get('data-node-name').fold(
                        function(x) {
                            return x.get();
                        },
                        constant('xxxx')
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
    replaceName = function(a) {
        return function(b) {
            return b._1.replace(/{{name}}/g, b._2);
        };
    },
    replaceAttribute = function(a) {
        return function(b) {
            return b._1.replace(/{{attr}}/g, b._2);
        };
    },
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
    tag = function(a) {
        return function(b) {
            var M = State.StateT(IO),

                program = M.lift(defaultTag)
                .chain(compose(M.modify)(extractName(a._1)))
                .chain(compose(M.modify)(replaceName))
                .chain(constant(M.get))
                .chain(compose(M.modify)(extractAttributes(a._1)))
                .chain(compose(M.modify)(replaceAttribute))
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
        .chain(compose(M.modify)(function(a) {
            return constant(a);
        }))
        .chain(constant(M.get));

    return program.exec('');
}

// Export
if(typeof module != 'undefined')
    module.exports = output;