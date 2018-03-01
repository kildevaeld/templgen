{
    var tokens = require('./types');
    var Token = tokens.Token;
    var TagType = tokens.TagType;
    var LiteralType = tokens.LiteralType;
    var MathOperator = tokens.MathOperator;
    var Primitive = tokens.Primitive;
    var Operator = tokens.Operator;

    var createExpression = require('./expressions').createExpression;

    function extractList(list, index) {
        return list.map(function(element) { return element[index]; });
    }

    function buildList(head, tail, index) {
        return [head].concat(extractList(tail, index));
    }

    var slice = Array.prototype.slice;
    function expression() {
        var args = slice.call(arguments);
        var type = args.shift();
        return createExpression.apply(null, [type, location()].concat(args));
    }

    function flatten(a) {
      return a.reduce((p, c) => p.concat(Array.isArray(c) ? flatten(c) : c), []);
    }

}


start = __ b:start_body? __ { return expression(Token.Context, b); }

start_body = first:start_body_type rest:( __  s:start_body_type { return s; })* {
    return expression(Token.Body, flatten([first].concat(rest)));
}

start_body_type = Import / CustomType / Template / Comment

body = b:( Tag / Comment / content )+ {
    return expression(Token.Body, flatten(b));
}

content = a:( !( Open / Close / Comment ) a:( . ) { return a })+ { return expression(Token.Raw, a.join('')); } 

Comment = '{#' c:( !'#}' a:( . ) { return a; } )+ '#}' { return expression(Token.Comment, c.join('')); } 

