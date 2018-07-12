"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const golang_1 = require("../generators/golang");
const typescript_1 = require("../generators/typescript");
const Path = __importStar(require("path"));
const fs = __importStar(require("mz/fs"));
const template_parser_1 = require("../template_parser");
const passes_1 = require("../passes");
function generateFiles(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = argv.files;
        if (argv.name != 'golang' && argv.name != 'typescript') {
            throw new Error('could not find generator');
        }
        const data = yield Promise.all(files.map((m) => fs.readFile(m).then(buf => ({
            file: Path.resolve(m),
            buffer: buf
        }))));
        let asts = data.map(m => {
            let o = template_parser_1.parse(m.buffer.toString());
            o.file = m.file;
            return o;
        });
        asts = yield Promise.all(asts.map(m => passes_1.passes(m)));
        let gen = argv.name === 'golang' ? new golang_1.GolangVisitor : new typescript_1.TypescriptVisitor;
        let output_data = asts.map(m => ({
            content: gen.parse(m, { package: 'template' }),
            ctx: m,
        }));
        let out = argv.output;
        for (let o of output_data) {
            let fn = Path.basename(o.ctx.file) + '.go';
            if (!out) {
                process.stdout.write(`## ${fn}\n\n${o.content}\n`);
                continue;
            }
            let op = Path.join(Path.resolve(out), fn);
            yield fs.writeFile(op, o.content);
        }
    });
}
function generateCommand(yargs) {
    return yargs.command({
        command: 'generate <files...>',
        aliases: ["gen", "g"],
        builder: (yargs) => yargs.option('output', {
            alias: 'o',
            type: 'string',
        }).option('name', {
            alias: 'n',
            type: 'string'
        }),
        handler: (argv) => {
            generateFiles(argv);
        }
    });
}
exports.generateCommand = generateCommand;
