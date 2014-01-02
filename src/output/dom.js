var IO = require('fantasy-io'),
    DOM = require('../dom'),

    combinators = require('fantasy-combinators'),

    compose = combinators.compose,
    constant = combinators.constant;

function str(x) {
    return document.createTextNode(x);
}

function tag(name) {
    return function(attr, children) {
        return document.createElement(name);
    };
}

function output(root) {
    return root.cata({
        html: tag('html'),
        // Document
        head: tag('head'),
        title: tag('title'),
        base: tag('base'),
        link: tag('link'),
        meta: tag('meta'),
        style: tag('style'),
        // Scripting
        script: tag('script'),
        noscript: tag('noscript'),
        // Sections
        body: tag('body'),
        section: tag('section'),
        nav: tag('nav'),
        article: tag('article'),
        aside: tag('aside'),
        h1: tag('h1'),
        h2: tag('h2'),
        h3: tag('h3'),
        h4: tag('h4'),
        h5: tag('h5'),
        h6: tag('h6'),
        header: tag('header'),
        footer: tag('footer'),
        address: tag('address'),
        main: tag('main'),
        // Grouping
        p: tag('p'),
        hr: tag('hr'),
        pre: tag('pre'),
        blockquote: tag('blockquote'),
        ol: tag('ol'),
        ul: tag('ul'),
        li: tag('li'),
        dl: tag('dl'),
        dt: tag('dt'),
        dd: tag('dd'),
        figure: tag('figure'),
        figcaption: tag('figcaption'),
        div: tag('div'),
        // Text-level
        a: tag('a'),
        em: tag('em'),
        strong: tag('strong'),
        small: tag('small'),
        s: tag('s'),
        cite: tag('cite'),
        q: tag('q'),

        // Special
        text: str,
        x: rot(tag),
        nop: constant(str(''))
    });
}

// Export
if(typeof module != 'undefined')
    module.exports = output;