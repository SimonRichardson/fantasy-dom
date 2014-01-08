var λ = require('../lib/test'),
    mock = require('../lib/dom'),
    IO = require('fantasy-io'),
    laws = require('fantasy-check').laws,
    Seq = require('fantasy-seqs').Seq,

    dom = require('../../fantasy-dom'),
    Attr = dom.Attr,
    DOM = dom.DOM,
    Output = dom.Output,

    functor = laws.functor,
    monad = laws.monad,

    identity = λ.identity,

    scaffold = function(title) {
        return DOM.html(
                Attr.empty(),
                Seq.fromArray([
                    DOM.head(
                        Attr.empty(),
                        Seq.of(
                            DOM.title(title)
                        )
                    ),
                    DOM.body(
                        Attr.of({className: 'body'}),
                        Seq.fromArray([
                            DOM.h1(
                                Attr.withValue(title),
                                Seq.empty()
                            ),
                            DOM.div(
                                Attr.withValue(title),
                                Seq.empty()
                            )
                        ])
                    )
                ])
            );
    },
    scaffoldOutput = function(name) {
        var createHead = function() {
                var head = mock.createElement('head'),
                    title = mock.createElement('title'),
                    text = mock.createTextNode(name);

                head.appendChild(title);
                title.appendChild(text);

                return head;
            },
            createBody = function() {
                var body = mock.createElement('body'),
                    h1 = mock.createElement('h1'),
                    div = mock.createElement('div'),
                    h1Text = mock.createTextNode(name),
                    divText = mock.createTextNode(name);

                body.setAttribute('class', 'body');

                body.appendChild(h1);
                body.appendChild(div);

                h1.appendChild(h1Text);
                div.appendChild(divText);

                return body;
            },

            frag = mock.createDocumentFragment();

            html = mock.createElement('html');

        frag.appendChild(html);
        
        html.appendChild(createHead());
        html.appendChild(createBody());

        return frag;
    };

exports.dom = {
    'when testing scaffolding output should return correct value': λ.check(
        function(a) {
            var x = Output.dom(mock)(scaffold(a)).unsafePerform(),
                y = scaffoldOutput(a);

            return λ.deepEquals(x, y);
        },
        [String]
    )
};