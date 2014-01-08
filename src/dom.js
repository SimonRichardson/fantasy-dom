var Attr = require('./attr'),
    Tree = require('./tree'),
    helpers = require('fantasy-helpers'),
    seq = require('fantasy-seqs'),
    names = require('./names'),

    extend = helpers.extend,
    singleton = helpers.singleton,
    Seq = seq.Seq,

    fruitful = function(name) {
        return function(x, y) {
            return Tree.Node(
                x.add(names.nodeName, name),
                y
            );
        };
    },
    childless = function(name) {
        return function(x) {
            return Tree.Node(
                x.add(names.nodeName, name),
                Seq.empty()
            );
        };
    },
    value = function(name) {
        return function(x) {
            var o = extend(
                singleton(names.nodeName, name),
                singleton(names.nodeValue, x)
            );
            return Tree.Node(
                Attr.of(o),
                Seq.empty()
            );
        };
    };

    DOM = {
        // Root
        html: fruitful('html'),
        // Document
        head: fruitful('head'),
        title: value('title'),
        base: childless('base'),
        link: childless('link'),
        meta: childless('meta'),
        style: childless('style'),
        // Scripting
        script: childless('script'),
        noscript: fruitful('noscript'),
        // Sections
        body: fruitful('body'),
        section: fruitful('section'),
        nav: fruitful('nav'),
        article: fruitful('article'),
        aside: fruitful('aside'),
        h1: fruitful('h1'),
        h2: fruitful('h2'),
        h3: fruitful('h3'),
        h4: fruitful('h4'),
        h5: fruitful('h5'),
        h6: fruitful('h6'),
        header: fruitful('header'),
        footer: fruitful('footer'),
        main: fruitful('main'),
        // Grouping
        p: fruitful('p'),
        hr: childless('hr'),
        pre: fruitful('pre'),
        blockquote: fruitful('blockquote'),
        ol: fruitful('ol'),
        ul: fruitful('ul'),
        li: fruitful('li'),
        dl: fruitful('dl'),
        dt: fruitful('dt'),
        dd: fruitful('dd'),
        figure: fruitful('figure'),
        figcaption: fruitful('figcaption'),
        div: fruitful('div'),
        // Text-level
        a: fruitful('a'),
        em: fruitful('em'),
        strong: fruitful('strong'),
        small: fruitful('small'),
        s: fruitful('s'),
        cite: fruitful('cite'),
        q: fruitful('q'),
        dfn: fruitful('dfn'),
        abbr: fruitful('abbr'),
        data: fruitful('data'),
        time: fruitful('time'),
        code: fruitful('code'),
        'var': fruitful('var'),
        samp: fruitful('samp'),
        kbd: fruitful('kbd'),
        sub: fruitful('sub'),
        sup: fruitful('sup'),
        i: fruitful('i'),
        b: fruitful('b'),
        u: fruitful('u'),
        mark: fruitful('mark'),
        ruby: fruitful('ruby'),
        rt: fruitful('rt'),
        rp: fruitful('rp'),
        bdi: fruitful('bdi'),
        bdo: fruitful('bdo'),
        span: fruitful('span'),
        br: childless('br'),
        wbr: childless('wbr'),
        // Edits
        ins: fruitful('ins'),
        del: fruitful('del'),
        // Embedded
        img: childless('img'),
        iframe: fruitful('iframe'),
        embed: fruitful('embed'),
        object: fruitful('object'),
        param: childless('param'),
        video: fruitful('video'),
        audio: fruitful('audio'),
        source: fruitful('source'),
        track: fruitful('track'),
        canvas: fruitful('canvas'),
        map: fruitful('map'),
        area: fruitful('area'),
        svg: fruitful('svg'),
        math: fruitful('math'),
        // Tabular
        table: fruitful('table'),
        caption: fruitful('caption'),
        colgroup: fruitful('colgroup'),
        col: fruitful('col'),
        tbody: fruitful('tbody'),
        thead: fruitful('thead'),
        tfoot: fruitful('tfoot'),
        tr: fruitful('tr'),
        td: fruitful('td'),
        th: fruitful('th'),
        // Forms
        form: fruitful('form'),
        fieldset: fruitful('fieldset'),
        legend: fruitful('legend'),
        label: fruitful('label'),
        input: fruitful('input'),
        button: fruitful('button'),
        select: fruitful('select'),
        datalist: fruitful('datalist'),
        optgroup: fruitful('optgroup'),
        option: fruitful('option'),
        textarea: fruitful('textarea'),
        keygen: childless('keygen'),
        output: childless('output'),
        progress: childless('progress'),
        meter: childless('meter'),
        // Interactive
        details: fruitful('details'),
        summary: fruitful('summary'),
        menuitem: fruitful('menuitem'),
        menu: fruitful('menu'),
        // Special
        x: fruitful
    };

// Export
if(typeof module != 'undefined')
    module.exports = DOM;
