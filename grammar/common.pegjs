
Variable = v:variable { return expression(Token.Variable, v); }

variable = a:([a-zA-Z_]+) { return a.join(''); } 
	//= a:([a-zA-Z_]+) { return expression(Token.Variable, a.join('')); } 

accessor 
	= a:([a-zA-Z_]+) b:('.' b:([a-zA-Z_]+ / [0-9]+) { return b.join('')})* { return expression(Token.Accessor, [a.join('')].concat(b)); }  

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