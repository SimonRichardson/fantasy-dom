function str(x) {
    return '' + x;
}

function tag(name) {
    return function(attr, children) {
        var x = Object.keys(attr).map(function(x) {
                return attr[x] ? x + '="' + attr[x] + '" ' : str(x);
            }),
            y = children.map(function(a) {
                return a.x;
            }),

            a = x.join(''),
            b = a.substr(-1) === ' ' ? a.substr(0, a.length - 1) : a,

            n = y.toArray().join('');
        return '<' + name + ' ' + b + '>' + n + '</' + name + '>';
    };
}

function output(root) {
    return root.cata({
        h1: tag('h1'),
        text: str
    });
}

// Export
if(typeof module != 'undefined')
    module.exports = output;
