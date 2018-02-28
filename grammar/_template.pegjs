{
    var tokens = require('./types');
    var Token = tokens.Token;
    var TagType = tokens.TagType;
    var LiteralType = tokens.LiteralType;
    var MathOperator = tokens.MathOperator;
    var Operator = tokens.Operator;

    //var Type = tokens.Type;
    var flatten = require('./utils').flatten;
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

start = __ c:Context? __ b:body { return expression(Token.Template, b); }

body = ( Tag / Comment / content )+

content = a:( !( Open / Close / Comment ) a:( . ) { return a })+ { return expression(Token.Raw, a.join('')); } 

Comment = '{#' c:( !'#}' a:( . ) { return a; } )+ '#}' { return expression(Token.Comment, c.join('')); } 

Tag = t:(  tag_control_statements / tag_code / tag_assignment ) { return t }

tag_assignment = Open '=' a:tag_assignment_modifier?  __ v:expression __ Close { 
  //return expression(Token.Assignment, null, v);
  return expression(Token.Tag, TagType.Assignment, v, a); 
}

tag_assignment_modifier = 's' / 'i' / 'f' / '!'

tag_control_statements =  tag_if_stmt / tag_loop_stmt

tag_if_stmt 
	=  Open __ "if" __ i:variable __ Close ib:body* __ ei:(__ t:tag_elseif_stmt { return t; })* __ el:tag_else_stmt?  __ Open __ "end" __ Close {
        return expression(Token.Conditional, i, ib, ei, el);
    }

tag_elseif_stmt = Open __ "elif" __ e:expression __ Close b:body? { return expression(Token.Block, e, b); }

tag_else_stmt = Open __ "else" _ Close b:body+ { return expression(Token.Block, null, b); }

tag_loop_stmt
  = Open __ "for" __  v:variable __ "in" __ fexp:for_loop_exp __ Close __ b:body* __ Open __ "end" __ Close {
    //return [v, fexp, b];
    return expression(Token.Loop, null, v, fexp, b);
  }
  / Open __ "for" __ i:variable __ "," __ v:variable __ "in" __ fexp:for_loop_exp __ Close __ b:body* __ Open __ "end" __ Close {
    //return [i, v, fexp, b];
    return expression(Token.Loop, i, v, fexp, b);
  }


tag_code = Open "!" __ r:code __ Close { return r}

expression =  e:(function_call / tenary / Math / literal / variable) { return e; }


code = r:(__ s:statement { return s; })+ { return r; }

statement = binary_eq / if_stmt / for_loop / assignment / expression

if_stmt = "if" __ ie:( binary_eq / expression) __ "{" ib:(__ statement)*  __"}" elif:(__ if_else_if_stmt)* __ el:if_else_stmt? {
    return expression(Token.Conditional, ie[0], ib, elif, el);
}

if_else_if_stmt = "elif" __ a:( binary_eq / expression ) __ "{" s:(__ statement)* __ "}" {
    return expression(Token.Block, a, s);
}

if_else_stmt = "else" __ "{" s:(__ statement)* __ "}" { return expression(Token.Block, s); }


for_loop = "for" __ i:variable __ "," __ v:variable  __ "in" __ e:for_loop_exp __ "{" s:(__ statement)* __ "}" {
    return expression(Token.Loop, i,v,e,flatten(s))
}
    / "for" __ v:variable __ "in" __ e:for_loop_exp __ "{" s:(__ statement)* __ "}" {
        return expression(Token.Loop, null, v, e, flatten(s));
    }
    
for_loop_exp = function_call / tenary / literal / variable

tenary = a:variable __ "?" __  b:variable __ ':' __ c:variable { return expression(Token.Tenary, a, b, c);   }

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

function_call
	= v:variable "(" p:function_call_params? ")"  { return expression(Token.FunctionCall, v.name, p)}
    
function_call_params
	= first:expression __ rest:("," __ v:expression { return v; })* { return [first].concat(rest) }
    
variable 
	= a:([a-zA-Z_]+) { return expression(Token.Variable, a.join('')); }  

assignment 
    = v:variable __ i:":"? "=" __ e:(expression / binary_ops) { return 
      return expression(Token.Assignment, v, e, !!i);
    }

Open = '{%'

Close = '%}'


/**
 Scalers
*/
literal = Number / String 


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

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

_
	= [ \t\n\r]
    
__
	= _*



// MATH

Math = r:(math_expression / primary) { return r; }

primary
    = Number
    / function_call
    / variable
    / "(" any:Math ")" { return any; }
    

math_expression
    = left:primary __ op:math_operator __ right:Math { return expression(Token.Arithmetic, left, op, right); }

math_operator
    = a:("+" / "*" / "-" / "/" / "^") {
      switch (a) {
        case "+": return MathOperator.Add;
        case "*": return MathOperator.Mul;
        case "-": return MathOperator.Sub;
        case "/": return MathOperator.Div;
        case "^": return MathOperator.Pow;
      }
    }


 
float "float"
    = left:[0-9]+ "." right:[0-9]+ { return parseFloat(left.join("") + "." + right.join("")); }
 
integer "integer"
    = digits:[0-9]+ { return parseInt(digits.join(""), 10); }


// Context
Context = "context" _+ n:variable __ "{" __ p:property_list? __ "}" { return }

property_list = p:property rest:(_+ p:property { return p; })* { return [p].concat(rest); }

property = n:variable (":" / _) __  p:(primitive)

primitive 
  =  "int"
  / "string" 