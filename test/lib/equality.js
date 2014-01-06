var helpers = require('fantasy-helpers'),
    seq = require('fantasy-seqs'),

    Seq = seq.Seq;

function arrayEquals(a, b, f) {
    var g = f || helpers.strictEquals;
    return a.zip(b).fold(true, function(a, b) {
        return a && g(b._1)(b._2);
    });
}

function objectEquals(a, b, f) {
    return arrayEquals(
        Seq.fromArray(Object.keys(a).sort()),
        Seq.fromArray(Object.keys(b).sort()),
        f
    );
}

if (typeof module != 'undefined')
    module.exports = {
        arrayEquals: arrayEquals,
        objectEquals: objectEquals
    };