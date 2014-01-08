var daggy = require('daggy'),
    IO = require('fantasy-io'),
    State = require('fantasy-states'),
    combinators = require('fantasy-combinators'),
    tuples = require('fantasy-tuples'),
    dom = require('./output/dom'),

    compose = combinators.compose,
    constant = combinators.constant,

    Tuple2 = tuples.Tuple2,

    Component = daggy.tagged('x');

Component.of = function(x) {
    return Component(x);
};

// Methods
Component.prototype.fold = function(f) {
    return f(this.x);
};
Component.prototype.chain = function(f) {
    return this.fold(function(a) {
        return f(a);
    });
};

// Derived
Component.prototype.map = function(f) {
    return this.chain(function(a) {
        return Component.of(f(a));
    });
};

// Common
Component.prototype.append = function(a) {
    var M = State.StateT(IO);
    return this.fold(function(x) {
        var program = M.lift(a)
            .chain(compose(M.modify)(constant))
            .chain(constant(M.get))
            .chain(function(a) {
                return M.modify(function(b) {
                    return Tuple2(dom(b)(x), b);
                });
            })
            .chain(constant(M.get))
            .chain(function(a) {
                return M.lift(a._1);
            })
            .chain(compose(M.modify)(function(a) {
                return function(b) {
                    // Finally append the fragment to the
                    // required DOM element
                    return b._2.appendChild(a);
                };
            }))
            .chain(constant(M.get));

        return program.exec();
    });
};

// Export
if(typeof module != 'undefined')
    module.exports = Component;
