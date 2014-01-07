# Fantasy-DOM

This library implements purely functional, monadic DOM structure.

![](https://raw.github.com/puffnfresh/fantasy-land/master/logo.png)

![](https://api.travis-ci.org/SimonRichardson/fantasy-dom.png)

### Guide

The library implements its data structure a completely immutable 
data structure. In reality this means that there are no internal
changes what so ever!

### Todo:

- Implement event streams
- Rendering via DOM (`createElement` etc)
- Delayed rendering via `requestAnimationFrame`

```javascript
var h1 = DOM.h1(
    Attr.withId('title'),
    Seq.fromArray([
        DOM.Span(
            Attr.withValue('Hello World!'),
            Seq.empty();
        )
    ]));

render(event(h1).click().map(function() {
    return e.value + '!';
}));
```
