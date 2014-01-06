var Attr = require('./attr'),
    Element = require('./element'),
    Tree = require('./tree'),
    helpers = require('fantasy-helpers'),
    seq = require('fantasy-seqs'),
    names = require('./names'),

    extend = helpers.extend,
    singleton = helpers.singleton,
    Seq = seq.Seq,

    fruitful = function(name) {
        return function(x, y) {
            return Element.of(
                Tree.Node(x.add(names.nodeName, name), y)
            );
        };
    },
    childless = function(name) {
        return function(x) {
            return Element.of(
                Tree.Node(x.add(names.nodeName, name), Seq.empty())
            );
        };
    },
    value = function(name) {
        return function(x) {
            var o = extend(
                singleton(names.nodeName, name),
                singleton(names.nodeValue, x)
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