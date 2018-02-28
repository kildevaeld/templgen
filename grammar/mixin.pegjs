
Mixin 
    = Open __ "mixin" _+ v:variable __ p:mixin_params? __ Close b:body? __ Open __ "end" __ Close {
        return expression(Token.Mixin, v, p, b);
    }

mixin_params 
    = "(" __ first:variable rest:(',' __ variable) __ ")" { return [first].concat(rest); }
    