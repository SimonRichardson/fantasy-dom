var daggy = require('daggy'),

    Lens = require('fantasy-lenses'),
    Store = require('fantasy-stores'),
    
    DOM = daggy.taggedSum({
        h1: ['x', 'y'],
        text: ['x']
    });

DOM.of = function(a) {
    return DOM.text(a);
};
DOM.lens = function() {
    return Lens(function(a) {
        return Store(
            function(s) {

            },
            function() {

            }
        );
    });
};

// Methods
DOM.prototype.chain = function(f) {
    return f(this.x);
};

// Derived
DOM.prototype.map = function(f) {
    return this.chain(function(a) {
        return DOM.of(f(a));
    });
};

// Common
DOM.prototype.update = function(f) {
    var m = this;
    return this.chain(function(a) {
        return m.constructor(f(a));
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = DOM;
