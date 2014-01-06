var daggy = require('daggy'),

    Stream = daggy.tagged('x');

// Export
if(typeof module != 'undefined')
    module.exports = Stream;
