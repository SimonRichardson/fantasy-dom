function query(a) {
    return function(x) {
        throw new Error('Missing implementation');
    };
}

// Export
if(typeof module != 'undefined')
    module.exports = query;
