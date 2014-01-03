var daggy = require('daggy'),
    Element = daggy.tagged('x'),
    combinators = require('fantasy-combinators'),

    constant = combinators.constant;

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

// Common
Element.prototype.getByIdent = function(x) {
    return this.fold(function(a) {
        return a.find(function(attr) {
            return attr.get('id').fold(
                function(y) {
                    return x === y.get();
                },
                constant(false)
            );
        });
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Element;