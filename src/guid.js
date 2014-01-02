var IO = require('fantasy-io');

function guid() {
    // This can be improved!
    return IO(function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    });
}

// Export
if(typeof module != 'undefined')
    module.exports = guid;