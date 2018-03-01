
CustomType =  t:(__ t:custom_type { return t; })+ { return t; }


custom_type = "type" __ n:variable __ "{" __ p:type_list __ "}" {
    return expression(Token.CustomType, n, p);
}

type_list = r:(__ s:property { return s; })+ { return r; }


property = n:variable (":" / _+) __  p:(Type) {
    return expression(Token.Property, n, p);
}

ArrayType
    = "[]" t:Type { return expression(Token.Array, t); }

Type = Primitive / UserType / ArrayType;

UserType = v:variable { return expression(Token.UserType, v); }

Primitive 
  = p:primitive { return expression(Token.Primitive, p); }

primitive 
  =  "int" { return Primitive.Int; }
  / "float" { return Primitive.Float; }
  / "boolean" { return Primitive.Boolean; }
  / "string"  { return Primitive.String; }
  / "date" { return Primitive.Date; }
