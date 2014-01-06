var daggy = require('daggy'),
    combinators = require('fantasy-combinators'),
    names = require('./names'),

    constant = combinators.constant,
    identity = combinators.identity,

    Element = daggy.tagged('x');

Element.of = function(a) {
    return Element(a);
};

// Methods
Element.prototype.fold = function(f) {
    return f(this.x);
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
    }, this.x.constructor);
};
Element.prototype.traverse = function(f, p) {
    return p.of(f(this.x));
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
    return this.fold(function(a) {
        console.log('!!', a);
        return a.size();
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Element;
