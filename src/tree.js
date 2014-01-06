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
    // FIXME (Simon) : Remove the state.
    var found = Option.None,
        rec = function(a) {
            return a.cata({
                Node: function(x, y) {
                    if(f(x)) {
                        found = Option.of(a);
                        return found;
                    } else {
                        return y.find(function(a) {
                            return rec(a).fold(
                                function(b) {
                                    found = Option.of(b);
                                    return true;
                                },
                                constant(false)
                            );
                        });
                    }
                }
            });
        };
    rec(this);
    return found;
};
Tree.prototype.size = function(f) {
    var rec = function(a, v) {
        return a.cata({
            Node: function(x, c) {
                return c.fold(v, function(a, b) {
                    return rec(b, a + 1);
                });
            }
        });
    };
    return rec(this, 1);
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
