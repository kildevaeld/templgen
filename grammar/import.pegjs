
Import = "import" _+ p:path { return expression(Token.Import, p); }

path = ('./' / '/')? [a-zA-Z0-9_\.]+ ( '/' [a-zA-Z0-9_\.]+ )* {
    return text();
}