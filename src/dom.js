var daggy = require('daggy'),
    combinators = require('fantasy-combinators'),
    helpers = require('fantasy-helpers'),

    constant = combinators.constant,
    identity = combinators.identity,
    functionLength = helpers.functionLength,

    Lens = require('fantasy-lenses').Lens,
    Store = require('fantasy-stores'),
    Option = require('fantasy-options'),
    Seq = require('fantasy-seqs').Seq,
    Type = require('./type'),
    
    fruitful = function() {
        return ['attr', 'children'];
    },
    childless = function() {
        return ['attr'];
    },
    value = function() {
        return ['value'];
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
        text: value(),
        x: fruitful().concat(['name']),
        nop: []
    });

DOM.of = function(a) {
    return DOM.text(a);
};
DOM.empty = function() {
    return DOM.empty;
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
    attr: DOM.lens('attr'),
    children: DOM.lens('children'),
    value: DOM.lens('value')
};

// Methods
// (NOTE) Simon: Chain doesn't make any sense in this context!
DOM.prototype.chain = function(f) {
    // Note: This is a bit of a hack to prevent the need
    // to provide every single tagged sum to chain!
    var type = this.toType();
    return type.fold(f, f, f, identity);
};

// Derived
// (NOTE) Simon: Map doesn't make any sense in this context!
DOM.prototype.map = function(f) {
    return this.chain(function(a) {
        return DOM.of(f(a));
    });
};

// Common
DOM.prototype.getByIdent = function(x) {
    var parental = function(a) {
            return function(attr, children) {
                return attr.get('id').fold(
                    constant(Option.of(a)),
                    function() {
                        return children.find(function(a) {
                            return rec(a, x, y);
                        });
                    }
                );
            };
        },
        rec = function(a, b, c) {
            return a.toType().fold(
                parental(a, b, c),
                parental(a, b, c),
                constant(Option.None),
                constant(Option.None)
            );
        };
    return rec(this);
};
DOM.prototype.update = function(f) {
    var m = this;
    return m.toType().fold(
        modifyAttributes(m, f),
        modifyAttributes(m, f),
        modifyValue(m, f),
        identity
    );
};

// IO
DOM.prototype.toType = function() {
    return Type.fromDOM(this);
};

// Private
function modifyAttributes(o, f) {
    return function() {
        return o.chain(function(a) {
            var lens = DOM.lenses.attr.run(o);
            return lens.set(f(a));
        });
    };
}
function modifyValue(o, f) {
    return function() {
        return m.chain(function(a) {
            var lens = DOM.lenses.value.run(o);
            return lens.set(f(a));
        });
    };
}

// Export
if(typeof module != 'undefined')
    module.exports = DOM;
