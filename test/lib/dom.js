// Note (Simon) : Mutable State
// We could implement our own mocking lib in the future (yak shaving)!
var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    Element = daggy.tagged('tagName'),
    DocumentFragment = daggy.tagged('children'),
    TextNode = daggy.tagged('value'),

    singleton = helpers.singleton,

    mock = {
        createElement: function(name) {
            return initElement(Element(name));
        },
        createDocumentFragment: function() {
            return initDocumentFragment(DocumentFragment([]));
        },
        createTextNode: function(text) {
            return TextNode(text);
        }
    },
    initElement = function(x) {
        x.attributes = {};
        x.children = [];
        x.ownerDocument = mock;
        return x;
    },
    initDocumentFragment = function(x) {
        return x;
    },

    // Horrible mutable state :(
    mixins = {
        Attribute: function(x) {
            x.prototype.setAttribute = function(name, value) {
                this.attributes[name] = value;
            };
            return x;
        },
        Node: function(x) {
            x.prototype.appendChild = function(node) {
                if (node instanceof DocumentFragment) {
                    this.children.push.apply(this.children, node.children);
                } else {
                    this.children.push(node);
                }
                return node;
            };
            return x;
        }
    };

// Create well known locations
mock.body = mock.createElement('body');

// Apply the mixins
mixins.Attribute(mixins.Node(Element));
mixins.Node(DocumentFragment);

if (typeof module != 'undefined')
    module.exports = mock;