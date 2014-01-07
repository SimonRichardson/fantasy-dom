var daggy = require('daggy'),

    Stream = daggy.tagged('fork');

Stream.of = function(a) {
    return Stream(
        function(next) {
            return next(a);
        }
    );
};

// Derived
Stream.prototype.chain = function(f) {
    var env = this;
    return Stream(
        function(next) {
            return env.fork(
                function(x) {
                    return f(x).fork(next);
                }
            );
        }
    );
};

// Methods
Stream.prototype.ap = function(a) {
    return this.chain(
        function(f) {
            return a.map(f);
        }
    );
};
Stream.prototype.map = function(f) {
    return this.chain(
        function(a) {
            return Stream.of(f(a));
        }
    );
};

// Export
if(typeof module != 'undefined')
    module.exports = Stream;
