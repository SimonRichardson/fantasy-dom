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
        x.events = [];
        x.ownerDocument = mock;
        return x;
    },
    initDocumentFragment = function(x) {
        x.events = [];
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
        },
        EventTarget: function(x) {
            x.prototype.addEventListener = function(type, func) {
                this.events.push({
                    type: type,
                    func: func
                });
            };
            x.prototype.removeEventListener = function(type, func) {
                var event,
                    i;
                for(i = 0; i < this.events.length; i++) {
                    event = this.events[i];
                    if (event.type === type && event.func === func) {
                        this.events.splice(i, 1);
                        break;
                    }
                }
            };
            x.prototype.dispatchEvent = function(event) {
                var i;
                for(i = 0; i < this.events.length; i++) {
                    if (this.events[i].type === event.type) {
                        this.events[i].func(event);
                        break;
                    }
                }
            };
        }
    };

// Create well known locations
mock.body = mock.createElement('body');

// Apply the mixins
mixins.EventTarget(
    mixins.Attribute(
        mixins.Node(
            Element
        )
    )
);
mixins.EventTarget(
    mixins.Node(
        DocumentFragment
    )
);

if (typeof module != 'undefined')
    module.exports = mock;