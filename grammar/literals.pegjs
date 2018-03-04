/**
    Literals
**/


literal = Number / String 

Boolean = b:boolean { return expression(Token.Literal, Primitive.Boolean, b); }  

boolean = "true" { return true; }
    / "false" { return false; }


Number = Integer / Float;

// Numbers
Integer "integer"
  = minus? int exp? { 
    return expression(Token.Literal, Primitive.Float, parseInt(text())); 
  }

Float "float"
  = minus? int frac exp? { 
    return expression(Token.Literal, Primitive.Float, parseFloat(text())); 
  }

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

String = s:string { return expression(Token.Literal, Primitive.String, s)}

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