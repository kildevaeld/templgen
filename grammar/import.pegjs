
Import = "import" _+ p:path { return expression(Token.Import, p); }

path = ('./' / '/')? [a-zA-Z0-9\-_\.]+ ( '/' [a-zA-Z0-9\-_\.]+ )* {
    return text();
}