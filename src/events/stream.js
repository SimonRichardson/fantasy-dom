var daggy = require('daggy'),

    Stream = daggy.tagged('fork');

Stream.of = function(a) {
    return Stream(
        function(next, done) {
            next(a);
            done();
        }
    );
};
Stream.empty = function() {
    return Stream(
        function(_, done) {
            return done();
        }
    );
};

// Derived
Stream.prototype.chain = function(f) {
    var env = this;
    return Stream(
        function(next, done) {
            return env.fork(
                function(x) {
                    return f(x).fork(
                        next,
                        function() {}
                    );
                },
                done
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
Stream.prototype.concat = function(a) {
    var env = this;
    return Stream(
        function(next, done) {
            return env.fork(
                next,
                function() {
                    a.fork(
                        next,
                        done
                    );
                }
            );
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
