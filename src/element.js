var daggy = require('daggy'),
    combinators = require('fantasy-combinators'),
    names = require('./names'),

    constant = combinators.constant,
    identity = combinators.identity,

    Element = daggy.tagged('elm');

Element.of = function(a) {
    return Element(a);
};

// Methods
Element.prototype.fold = function(f) {
    return f(this.elm);
};
Element.prototype.chain = function(f) {
    return this.fold(f);
};

// Derived
Element.prototype.map = function(f) {
    return this.chain(function(a) {
        return Element.of(f(a));
    });
};
Element.prototype.sequence = function() {
    return this.traverse(function(x) {
        return x.traverse(identity, Element);
    }, this.elm.constructor);
};
Element.prototype.traverse = function(f, p) {
    return p.of(f(this.elm));
};

// Common
Element.prototype.getByIdent = function(x) {
    return this.fold(function(a) {
        return a.find(function(attr) {
            return attr.get(names.ident).fold(
                function(y) {
                    return x === y.get();
                },
                constant(false)
            );
        });
    }).map(Element.of);
};
Element.prototype.getByTagName = function(x) {
    return this.fold(function(a) {
        return a.filter(function(attr) {
            return attr.get(names.nodeName).fold(
                function(y) {
                    return x === y.get();
                },
                constant(false)
            );
        });
    }).map(Element.of);
};
Element.prototype.size = function() {
    var rec = function(a, v) {
        return a.fold(function(b) {
            return b.cata({
                Node: function(x, c) {
                    return c.fold(v, function(a, b) {
                        return rec(b, a + 1);
                    });
                }
            });
        });
    };
    return rec(this, 1);
};



// Export
if(typeof module != 'undefined')
    module.exports = Element;
