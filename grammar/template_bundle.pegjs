{
    var tokens = require('./types');
    var Token = tokens.Token;
    var TagType = tokens.TagType;
    var LiteralType = tokens.LiteralType;
    var MathOperator = tokens.MathOperator;
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

start = __ c:Context? __ b:start_body { return expression(Token.Template, b); }


start_body = b:( Type / Template Comment / content )+ {
    return expression(Token.Body, flatten(b));
}

body = b:( Tag / Comment / content )+ {
    return expression(Token.Body, flatten(b));
}

content = a:( !( Open / Close / Comment ) a:( . ) { return a })+ { return expression(Token.Raw, a.join('')); } 

Comment = '{#' c:( !'#}' a:( . ) { return a; } )+ '#}' { return expression(Token.Comment, c.join('')); } 



Tag = t:( tag_control_statements / tag_assignment ) { return t }

tag_assignment = Open '=' a:tag_assignment_modifier?  __ v:(tenary / Math / literal / accessor) __ Close { 
  return expression(Token.Tag, TagType.Assignment, v, a); 
}

tag_assignment_modifier = 's' / 'i' / 'f' / '!'

tag_control_statements =  tag_if_stmt / tag_loop_stmt

tag_if_stmt 
	=  Open __ "if" __ i:if_exp __ Close ib:body? __ ei:(__ t:tag_elseif_stmt { return t; })* __ el:tag_else_stmt?  __ Open __ "end" __ Close {
        return expression(Token.Conditional, i, ib, ei, el);
    }

tag_elseif_stmt = Open __ "elif" __ e:if_exp __ Close b:body? { return expression(Token.Block, null, e, b); }

tag_else_stmt = Open __ "else" __ Close b:body? { return b; }

tag_loop_stmt
  = Open __ "for" __  v:variable __ "in" __ fexp:for_loop_exp __ Close b:body? __ Open __ "end" __ Close {
    //return [v, fexp, b];
    return expression(Token.Loop, null, v, fexp, b);
  }
  / Open __ "for" __ i:variable __ "," __ v:variable __ "in" __ fexp:for_loop_exp __ Close b:body? __ Open __ "end" __ Close {
    //return [i, v, fexp, b];
    return expression(Token.Loop, i, v, fexp, b);
  }


if_exp = tenary / literal / binary_eq / accessor

for_loop_exp = tenary / literal / accessor




expression =  e:(tenary / Math / literal / variable) { return e; }



tenary = a:accessor __ "?" __  b:accessor __ ':' __ c:accessor { return expression(Token.Tenary, a, b, c);   }

binary_eq = a:expression __ o:binary_ops __ b:expression { return expression(Token.Operation, a, o, b); } 

binary_ops = o:("==" / "!=" / ">=" / "<=" / ">" / "<") {
  switch (o) {
    case "==": return Operator.Eq;
    case "!=": return Operator.Neq;
    case ">=": return Operator.Gte;
    case ">": return Operator.Gt;
    case "<=": return Operator.Lte;
    case "<": return Operator.Lt;
  }
}
/**
    Literals
**/


literal = Number / String 

Boolean = b:boolean { return expression(Token.Literal, LiteralType.Boolean, b); }  

boolean = "true" { return true; }
    / "false" { return false; }


Number = n:number { return expression(Token.Literal, LiteralType.Number, n)} 

// Numbers
number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = decimal_point DIGIT+

int
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

// ----- 7. Strings -----

String = s:string { return expression(Token.Literal, LiteralType.String, s)}

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]


// MATH

Math = r:(math_expression / primary) { return r; }

primary
    = Number
    / accessor
    / "(" any:Math ")" { return any; }
    

math_expression
    = left:primary __ op:math_operator __ right:Math { return expression(Token.Arithmetic, left, op, right); }

math_operator
    = a:("+" / "*" / "-" / "/" / "^" / "%") {
      switch (a) {
        case "+": return MathOperator.Add;
        case "*": return MathOperator.Mul;
        case "-": return MathOperator.Sub;
        case "/": return MathOperator.Div;
        case "^": return MathOperator.Pow;
        case "%": return MathOperator.Mod;
      }
    }

// Context
Context = "context" _+ n:variable __ "{" __ p:property_list? __ "}" { return }

property_list = p:property rest:(_+ p:property { return p; })* { return [p].concat(rest); }

property = n:variable (":" / _) __  p:(primitive) {
    return expression(Token.Property, n, p);
}

primitive 
  =  "int"
  / "string" 


Template 
    = Open __ "template" _+ v:variable __ p:template_params? __ Close b:body? __ Open __ "end" __ Close {
        return expression(Token.Mixin, v, p, b);
    }


template_params 
    = "(" __ first:variable rest:(',' __ variable) __ ")" { return [first].concat(rest); }
    

template_param
    = n:variable __ ":" __ t:Type {
        return expression(Token.Parameter, n, t);
    }

Type = Open "!" t:(__ t:type { return t; })+ __ Close { return t; }


type = "type" __ n:variable __ "{" __ p:type_list __ "}" {
    return expression(Token.Type, n, p);
}

type_list = r:(__ s:property { return s; })+ { return r; }


variable 
	= a:([a-zA-Z_]+) { return expression(Token.Variable, a.join('')); } 


accessor 
	= a:([a-zA-Z_]+) b:('.' b:([a-zA-Z_]+) { return b.join('')})* { return expression(Token.Accessor, [a.join('')].concat(b)); }  

Open = '{%'

Close = '%}'

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

_
	= [ \t\n\r]
    
__
	= _*