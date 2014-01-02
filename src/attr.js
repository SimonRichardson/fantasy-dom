var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    guid = require('./guid'),

    extend = helpers.extend,
    singleton = helpers.singleton,

    Lens = require('fantasy-lenses').Lens,
    Store = require('fantasy-stores'),
    
    Attr = daggy.tagged('x');

Attr.of = function(a) {
    return Attr(a);
};
Attr.empty = function() {
    return Attr({});
};
Attr.withIdent = function(a) {
    return Attr(extend(a, {
        id: guid().unsafePerform()
    }));
};

// Methods
Attr.prototype.fold = function(f) {
    return f(this.x);
};
Attr.prototype.chain = function(f) {
    return this.fold(f);
};

// Derived
Attr.prototype.map = function(f) {
    return this.chain(function(a) {
        return Attr(f(a));
    });
};

// Common
Attr.prototype.add = function(k, v) {
    return this.map(function(a) {
        return extend(a, singleton(k, v));
    });
};
Attr.prototype.remove = function(k) {
    return this.map(function(a) {
        var b = extend(a, {});
        delete b[k];
        return b;
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Attr;
