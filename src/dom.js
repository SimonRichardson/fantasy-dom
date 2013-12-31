var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),

    functionLength = helpers.functionLength,

    Lens = require('fantasy-lenses').Lens,
    Store = require('fantasy-stores'),
    Seq = require('fantasy-seqs').Seq,
    
    DOM = daggy.taggedSum({
        h1: ['x', 'y'],
        text: ['x']
    });



DOM.of = function(a) {
    return DOM.text(a);
};
DOM.lens = function(property) {
    return Lens(function(o) {
        return Store(
            function(s) {
                var a = Seq.from(0, functionLength(o.constructor)),
                    r = o.constructor.apply(null, a.toArray()),
                    k;
                for(k in o) {
                    r[k] = o[k];
                }
                r[property] = s;
                return r;
            },
            function() {
                return o[property];
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
    var m = this,
        lens = DOM.lens('x').run(m);
    return this.chain(function(a) {
        return lens.set(f(a));
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = DOM;
