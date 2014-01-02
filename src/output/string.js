var IO = require('fantasy-io'),
    Option = require('fantasy-options'),
    DOM = require('../dom'),

    combinators = require('fantasy-combinators'),

    compose = combinators.compose,
    constant = combinators.constant,

    htmlIdentifiers = {
        'className': 'class'
    },
    ignoreIdentifiers = {
        'data-node-name': Option.None,
        'data-node-value': Option.None
    };

function rot(f) {
    return function() {
        var args = [].slice.call(arguments);
        args.unshift(args.pop());
        return f.apply(null, args);
    };
}

function str(x) {
    return '' + x;
}

function identifierName(x) {
    return x in htmlIdentifiers ? htmlIdentifiers[x] : x;
}
function ignoreIdentifier(x) {
    return x in ignoreIdentifiers ? ignoreIdentifiers[x] : Option.Some(x);
}

function serialiseAttributes(a) {
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
}

function serialiseChildren(s) {
    return s.map(output).toArray().join('');
}

function trimRight(x) {
    return x.substr(-1) === ' ' ? trimRight(x.substr(0, x.length - 1)) : x;
}

function tag(name) {
    return function(attr, children) {
        var w = serialiseAttributes(attr),
            x = serialiseChildren(children),
            y = w.length < 1 ? w : ' ' + w,
            z = attr.get('data-node-value').fold(
                function(a) {
                    return a.get() + x;
                },
                constant(x)
            );

        return '<' + name + y + '>' + z + '</' + name + '>';
    };
}

function output(root) {
    return root.fold(function(x) {
        return x.cata({
            Node: function(a, b) {
                return a.get('data-node-name').fold(
                    function(x) {
                        return tag(x.get())(a, b);
                    },
                    function(y) {
                        throw new Error('Expected Node name got nothing');
                    }
                );
            }
        });
    });
}

// Export
if(typeof module != 'undefined')
    module.exports = output;
