var combinators = require('fantasy-combinators'),
    names = require('../names'),

    constant = combinators.constant;

function getByIdent(a) {
    return function(x) {
        return a.find(function(attr) {
            return attr.get(names.ident).fold(
                function(y) {
                    return x === y.get();
                },
                constant(false)
            );
        });
    };
}

// Export
if(typeof module != 'undefined')
    module.exports = getByIdent;
