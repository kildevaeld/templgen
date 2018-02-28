

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