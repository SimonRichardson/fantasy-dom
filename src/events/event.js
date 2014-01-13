var Stream = require('./stream');

function event(dispatcher) {
    return function(type) {
        return Stream(
            function(next, done) {
                dispatcher.addEventListener(type, next);
            }
        );
    };
}

// Export
if(typeof module != 'undefined')
    module.exports = event;