var IO = require('fantasy-io'),
    Option = require('fantasy-options'),
    DOM = require('../dom'),

    names = require('../names'),
    combinators = require('fantasy-combinators'),
    helpers = require('fantasy-helpers'),

    compose = combinators.compose,
    constant = combinators.constant,

    extend = helpers.extend,
    singleton = helpers.singleton,

    htmlIdentifiers = {
        'className': 'class'
    },
    ignoreIdentifiers = extend(
        singleton(names.nodeName, Option.None),
        singleton(names.nodeValue, Option.None)
    ),
    rot = function (f) {
        return function() {
            var args = [].slice.call(arguments);
            args.unshift(args.pop());
            return f.apply(null, args);
        };
    },

    str = function(x) {
        return '' + x;
    },

    identifierName = function(x) {
        return x in htmlIdentifiers ? htmlIdentifiers[x] : x;
    },
    ignoreIdentifier = function(x) {
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

    serialiseChildren = function(s) {
        return s.map(output).toArray().join('');
    },

    trimRight = function(x) {
        return x.substr(-1) === ' ' ? trimRight(x.substr(0, x.length - 1)) : x;
    },

    tag = function(name) {
        return function(attr, children) {
            var w = serialiseAttributes(attr),
                x = serialiseChildren(children),
                y = w.length < 1 ? w : ' ' + w,
                z = attr.get(names.nodeValue).fold(
                    function(a) {
                        return a.get() + x;
                    },
                    constant(x)
                );

            return '<' + name + y + '>' + z + '</' + name + '>';
        };
    },

    output = function(root) {
        return root.fold(function(x) {
            return x.cata({
                Node: function(a, b) {
                    return a.get(names.nodeName).fold(
                        function(x) {
                            return tag(x.get())(a, b);
                        },
                        function(y) {
                            throw new TypeError('Unexpected TagName: name unknown.');
                        }
                    );
                }
            });
        });
    };

function main(root) {
    return IO(function() {
        return output(root);
    });
}

// Export
if(typeof module != 'undefined')
    module.exports = main;
