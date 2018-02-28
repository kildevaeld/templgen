
// Context
Context = "context" _+ n:variable __ "{" __ p:property_list? __ "}" { return }

property_list = p:property rest:(_+ p:property { return p; })* { return [p].concat(rest); }

property = n:variable (":" / _) __  p:(primitive) {
    return expression(Token.Property, n, p);
}

