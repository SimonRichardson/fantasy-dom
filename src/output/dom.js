// Note (Simon) : Mutation everywhere.
var IO = require('fantasy-io'),
    Option = require('fantasy-options'),
    DOM = require('../dom'),

    names = require('../names'),
    combinators = require('fantasy-combinators'),
    helpers = require('fantasy-helpers'),

    compose = combinators.compose,
    constant = combinators.constant,
    identity = combinators.identity,

    extend = helpers.extend,
    singleton = helpers.singleton,

    htmlIdentifiers = {
        'className': 'class'
    },
    ignoreIdentifiers = extend(
        singleton(names.nodeName, Option.None),
        singleton(names.nodeValue, Option.None),
        singleton(names.style, Option.None)
    ),

    str = function(x) {
        return '' + x;
    },

    identifierName = function(x) {
        return x in htmlIdentifiers ? htmlIdentifiers[x] : x;
    },
    ignoreIdentifier = function(x) {
        return x in ignoreIdentifiers ? ignoreIdentifiers[x] : Option.Some(x);
    },

    appendAttributes = function(node, a) {
        return a.fold(function(attr) {
            Object.keys(attr).map(function(x) {
                ignoreIdentifier(x).fold(
                    function(x) {
                        var z = identifierName(x);
                        node.setAttribute(z, attr[x]);
                    },
                    identity
                );
            });
            return node;
        });
    },
    appendChildren = function(doc, frag) {
        return function(node, a) {
            a.map(output(doc, frag));
            return node;
        };
    },

    tag = function(doc, frag) {
        return function(name) {
            return function(attr, children) {
                var node = doc.createElement(name),
                    append = appendChildren(doc, node);

                attr.get(names.nodeValue).map(
                    function(x) {
                        var text = doc.createTextNode(x.get());
                        node.appendChild(text);
                    }
                );
                
                frag.appendChild(node);

                return append(
                    appendAttributes(
                        node,
                        attr
                    ),
                    children
                );
            };
        };
    },

    output = function(doc, frag) {
        return function(root) {
            return root.cata({
                Node: function(a, b) {
                    return a.get(names.nodeName).fold(
                        function(x) {
                            return tag(doc, frag)(x.get())(a, b);
                        },
                        function(y) {
                            throw new TypeError('Unexpected TagName: name unknown.');
                        }
                    );
                }
            });
        };
    };

function main(doc) {
    return function(root) {
        return IO(function() {
            var a = doc.ownerDocument || doc,
                frag = a.createDocumentFragment();
            output(a, frag)(root);
            return frag;
        });
    };
}

// Export
if(typeof module != 'undefined')
    module.exports = main;
