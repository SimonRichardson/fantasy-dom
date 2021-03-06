var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    lenses = require('fantasy-lenses'),
    names = require('./names'),

    extend = helpers.extend,
    singleton = helpers.singleton,

    Lens = lenses.Lens,
    PartialLens = lenses.PartialLens,
    Store = require('fantasy-stores'),
    
    Attr = daggy.tagged('x');

Attr.of = function(a) {
    return Attr(a);
};
Attr.empty = function() {
    return Attr({});
};
Attr.withIdent = function(a) {
    return Attr(singleton(names.ident, a));
};
Attr.withName = function(a) {
    return Attr(singleton(names.nodeName, a));
};
Attr.withValue = function(a) {
    return Attr(singleton(names.nodeValue, a));
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
        return Attr.of(f(a));
    });
};

// Common
Attr.prototype.getIdent = function() {
    return get('id').getOrElse('');
};
Attr.prototype.add = function(k, v) {
    return this.map(function(a) {
        return extend(a, singleton(k, v));
    });
};
Attr.prototype.get = function(k) {
    return this.fold(function(x) {
        return PartialLens.objectLens(k).run(x);
    });
};
Attr.prototype.remove = function(k) {
    return this.map(function(a) {
        var b = extend({}, a);
        b[k] = null;
        delete b[k];
        return b;
    });
};
Attr.prototype.update = function(k, v) {
    return this.map(function(a) {
        return Lens.objectLens(k).run(a).set(v);
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Attr;
