var daggy = require('daggy'),
    Element = daggy.tagged('x');

Element.of = function(a) {
    return Element(a);
};

// Methods
Element.prototype.fold = function(f) {
    return f(this.x);
};


// Export
if(typeof module != 'undefined')
    module.exports = Element;