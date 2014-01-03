var daggy = require('daggy'),
    seq = require('fantasy-seqs'),
    combinators = require('fantasy-combinators'),
    Option = require('fantasy-options'),

    Seq = seq.Seq,

    constant = combinators.constant,
    identity = combinators.identity,

    Tree = daggy.taggedSum({
        Node: ['x', 'children']
    });

Tree.of = function(a) {
    return Tree.Node(a, Seq.empty());
};

// Methods
Tree.prototype.chain = function(f) {
    var rec = function(a) {
        return a.cata({
            Node: function(x, y) {
                return f(x).cata({
                    Node: function(a, b) {
                        return Tree.Node(
                            a,
                            b.concat(
                                y.map(
                                    function(n) {
                                        return rec(n);
                                    }
                                )
                            )
                        );
                    }
                });
            }
        });
    };
    return rec(this);
};

// Derived
Tree.prototype.ap = function(a) {
    return this.chain(function(f) {
        return a.map(f);
    });
};
Tree.prototype.map = function(f) {
    return this.chain(function(a) {
        return Tree.of(f(a));
    });
};

// Common
Tree.prototype.add = function(a) {
    return this.cata({
        Node: function(x, y) {
            return Tree.Node(x, y.concat(Seq.of(a)));
        }
    });
};
Tree.prototype.filter = function(f) {
    var rec = function(a) {
        return a.cata({
            Node: function(x, y) {
                return f(x) ?
                    Option.Some(
                        Tree.Node(
                            x,
                            y.fold(
                                Seq.empty(),
                                function(a, b) {
                                    return rec(b).fold(
                                        function(x) {
                                            return a.concat(Seq.of(x));
                                        },
                                        constant(a)
                                    );
                                }
                            )
                        )
                    ) :
                    Option.None;
            }
        });
    };
    return rec(this);
};
Tree.prototype.find = function(f) {
    var rec = function(a) {
        return a.cata({
            Node: function(x, y) {
                if(f(x)) {
                    return Option.of(a);
                } else {
                    return y.find(function(a) {
                        return rec(a).fold(
                            constant(true),
                            constant(false)
                        );
                    });
                }
            }
        });
    };
    return rec(this);
};

// IO
Tree.prototype.toSeq = function() {
    var rec = function(a, v) {
        return a.cata({
            Node: function(x, c) {
                return c.fold(v.concat(Seq.of(x)), function(a, b) {
                    return rec(b, a);
                });
            }
        });
    };
    return rec(this, Seq.empty());
};

// Export
if(typeof module != 'undefined')
    module.exports = Tree;