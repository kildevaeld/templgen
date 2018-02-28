

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