

Template 
    = Open __ "template" _+ v:variable __ p:template_params? __ Close b:body? __ Open __ "end" __ Close {
        return expression(Token.Template, v, p, b);
    }


template_params 
    = "(" __ first:template_param rest:(',' __ t:template_param { return t; })* __ ")" { return [first].concat(rest); }
    

template_param
    = n:variable _+ t:Type {
        return expression(Token.Parameter, n, t);
    }