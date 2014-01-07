var combinators = require('fantasy-combinators'),
    names = require('../names'),
    
    constant = combinators.constant;

function getByTagName(a) {
    return function(x) {
        return a.filter(function(attr) {
            return attr.get(names.nodeName).fold(
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
    module.exports = getByTagName;
