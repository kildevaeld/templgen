const fs = require('fs'),
    Parser = require('./lib/template_parser'),
    TypescriptVisitor = require('./lib/generators/typescript').TypescriptVisitor,
    GolangVisitor = require('./lib/generators/golang').GolangVisitor,
    UserValueVisitor = require('./lib').UserValueVisitor,
    util = require('util');

if (process.argv.length < 3) {
    console.log('usage: ast <path>');
    process.exit(1);
}

let path = process.argv[2];

let buffer = fs.readFileSync(path);

let ast = Parser.parse(buffer.toString('utf-8'));

/*
console.log(util.inspect(ast.toJSON(true, true), false, 10, true))
console.log(JSON.stringify(ast.toJSON(false, true), null, 2))
console.log(util.inspect(ast, false, 10, true));
console.log(util.inspect(ast.toJSON(false, true), false, 10, true));
console.log(JSON.stringify(ast.toJSON(false, true), null, 2));
*/
/*
console.log(util.inspect(ast.toJSON(false, true), false, 10, true));
process.exit()*/

let uv = new UserValueVisitor();

ast = uv.parse(ast);
//console.log(util.inspect(ast.toJSON(false, true), false, 15, true));
//process.exit()

let visitor = new GolangVisitor();

try {
    let out = visitor.parse(ast, {
        context: "models.Event",
        templateName: "Test",
    });
    console.log(out);
} catch (e) {
    console.error(e);
    console.error(visitor)
}