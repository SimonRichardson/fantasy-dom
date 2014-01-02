var IO = require('fantasy-io'),
    DOM = require('../dom'),

    combinators = require('fantasy-combinators'),

    compose = combinators.compose,
    constant = combinators.constant,

    identifiers = {
        'className': 'class'
    };

function rot(f) {
    return function() {
        var args = [].slice.call(arguments);
        args.unshift(args.pop());
        return f.apply(null, args);
    };
}

function str(x) {
    return '' + x;
}

function identifierName(x) {
    return x in identifiers ? identifiers[x] : x;
}

function serialiseAttributes(a) {
    return a.fold(function(o) {
        return trimRight(
            Object.keys(o).map(
                function(x) {
                    var z = identifierName(x);
                    return o[x] ? z + '="' + o[x] + '" ' : str(x);
                }
            ).join('')
        );
    });
}

function serialiseChildren(s) {
    return s.map(output).toArray().join('');
}

function trimRight(x) {
    return x.substr(-1) === ' ' ? trimRight(x.substr(0, x.length - 1)) : x;
}

function tag(name) {
    return function(attr, children) {
        var x = serialiseAttributes(attr),
            y = serialiseChildren(children),
            z = x.length < 1 ? x : ' ' + x;

        return '<' + name + z + '>' + y + '</' + name + '>';
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
