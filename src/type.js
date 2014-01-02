var daggy = require('daggy'),

    Type = daggy.taggedSum({
        Parent: ['x'],
        Parentless: ['x'],
        Value: ['x'],
        Valueless: ['x']
    }),

    parent = function(a) {
        return Type.Parent(a);
    },
    parentless = function(a) {
        return Type.Parentless(a);
    },
    value = function(a) {
        return Type.Value(a);
    },
    valueless = function(a) {
        return Type.Valueless(a);
    };

// Methods
Type.prototype.fold = function(a, b, c, d) {
    return this.cata({
        Parent: a,
        Parentless: b,
        Value: c,
        Valueless: d
    });
};

// IO
Type.prototype.toDOM = function() {
    return this.fold(identity, identity, identity, identity);
};

Type.fromDOM = function(a) {
    return a.cata({
        html: parent,
        // Document
        head: parent,
        title: parentless,
        base: parentless,
        link: parentless,
        meta: parentless,
        style: parentless,
        // Scripting
        script: parentless,
        noscript: parent,
        // Sections
        body: parent,
        section: parent,
        nav: parent,
        article: parent,
        aside: parent,
        h1: parent,
        h2: parent,
        h3: parent,
        h4: parent,
        h5: parent,
        h6: parent,
        header: parent,
        footer: parent,
        address: parent,
        main: parent,
        // Grouping
        p: parent,
        hr: parentless,
        pre: parent,
        blockquote: parent,
        ol: parent,
        ul: parent,
        li: parent,
        dl: parent,
        dt: parent,
        dd: parent,
        figure: parent,
        figcaption: parentless,
        div: parent,
        // Text-level
        a: parent,
        em: parent,
        strong: parent,
        small: parent,
        s: parent,
        cite: parentless,
        q: parent,

        // Special
        text: value,
        x: parent,
        nop: valueless
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Type;