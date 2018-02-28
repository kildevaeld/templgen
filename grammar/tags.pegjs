
Tag = t:( tag_control_statements / tag_assignment ) { return t }

tag_assignment = Open '=' a:tag_assignment_modifier?  __ v:(tenary / FunctionCall / Math / literal / accessor) __ Close { 
  return expression(Token.Assignment, v, a); 
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
  = Open __ "for" __  v:Variable __ "in" __ fexp:for_loop_exp __ Close b:body? __ Open __ "end" __ Close {
    //return [v, fexp, b];
    return expression(Token.Loop, null, v, fexp, b);
  }
  / Open __ "for" __ i:Variable __ "," __ v:Variable __ "in" __ fexp:for_loop_exp __ Close b:body? __ Open __ "end" __ Close {
    //return [i, v, fexp, b];
    return expression(Token.Loop, i, v, fexp, b);
  }


if_exp = tenary / literal / binary_eq / accessor

for_loop_exp = tenary / literal / accessor

