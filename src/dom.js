var Attr = require('./attr'),
    Element = require('./element'),
    Tree = require('./tree'),
    helpers = require('fantasy-helpers'),
    seq = require('fantasy-seqs'),

    extend = helpers.extend,
    singleton = helpers.singleton,
    Seq = seq.Seq,

    nodeName = 'data-node-name',
    nodeValue = 'data-node-value',

    fruitful = function(name) {
        return function(x, y) {
            return Element.of(
                Tree.Node(x.add(nodeName, name), y)
            );
        };
    },
    childless = function(name) {
        return function(x) {
            return Element.of(
                Tree.Node(x.add(nodeName, name), Seq.empty())
            );
        };
    },
    value = function(name) {
        return function(x) {
            var o = extend(
                singleton(nodeName, name),
                singleton(nodeValue, x)
            );
            return Element.of(
                Tree.Node(
                    Attr.of(o),
                    Seq.empty()
                )
            );
        };
    };

    DOM = {
        html: fruitful('html'),
        // Document
        head: fruitful('head'),
        title: value('title'),
        // Sections
        body: fruitful('body'),
        h1: fruitful('h1'),
        div: fruitful('div')
    };

// Export
if(typeof module != 'undefined')
    module.exports = DOM;