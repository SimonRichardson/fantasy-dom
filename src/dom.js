var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),

    functionLength = helpers.functionLength,

    Lens = require('fantasy-lenses').Lens,
    Store = require('fantasy-stores'),
    Seq = require('fantasy-seqs').Seq,
    
    fruitful = function() {
        return ['x', 'children'];
    },
    childless = function() {
        return ['x'];
    },
    singleton = function() {
        return ['x'];
    },

    DOM = daggy.taggedSum({
        html: fruitful(),
        // Document
        head: fruitful(),
        title: fruitful(),
        base: childless(),
        link: childless(),
        meta: childless(),
        style: childless(),
        // Scripting
        script: childless(),
        noscript: fruitful(),
        // Sections
        body: fruitful(),
        section: fruitful(),
        nav: fruitful(),
        article: fruitful(),
        aside: fruitful(),
        h1: fruitful(),
        h2: fruitful(),
        h3: fruitful(),
        h4: fruitful(),
        h5: fruitful(),
        h6: fruitful(),
        header: fruitful(),
        footer: fruitful(),
        address: fruitful(),
        main: fruitful(),
        // Grouping
        p: fruitful(),
        hr: childless(),
        pre: fruitful(),
        blockquote: fruitful(),
        ol: fruitful(),
        ul: fruitful(),
        li: fruitful(),
        dl: fruitful(),
        dt: fruitful(),
        dd: fruitful(),
        figure: fruitful(),
        figcaption: childless(),
        div: fruitful(),
        // Text-level
        a: fruitful(),
        em: fruitful(),
        strong: fruitful(),
        small: fruitful(),
        s: fruitful(),
        cite: fruitful(),
        q: childless(),
        // TODO: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/HTML5_element_list

        // Special
        text: singleton(),
        x: fruitful().concat(['name']),
        nop: []
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
DOM.lenses = {
    x: DOM.lens('x')
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
        lens = DOM.lenses.x.run(m);
    return this.chain(function(a) {
        return lens.set(f(a));
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = DOM;
