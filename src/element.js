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
    // Returns Element<Option<Tree>> need to return Option<Element<Tree>>
    return this.map(function(a) {
        return a.find(function(attr) {
            return attr.get(names.ident).fold(
                function(y) {
                    return x === y.get();
                },
                constant(false)
            );
        });
    }).sequence();
};
Element.prototype.getByTagName = function() {
    return this.fold(function(a) {
        
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Element;