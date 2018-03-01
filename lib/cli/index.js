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
const yargs = __importStar(require("yargs"));
const fs = __importStar(require("mz/fs"));
const template_parser_1 = require("../template_parser");
const util_1 = require("util");
const passes_1 = require("../passes");
const Path = __importStar(require("path"));
const generate_1 = require("./generate");
function createAst(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = argv.files;
        const data = yield Promise.all(files.map((m) => fs.readFile(m).then(buf => ({
            file: Path.resolve(m),
            buffer: buf
        }))));
        let asts = data.map(m => {
            let o = template_parser_1.parse(m.buffer.toString());
            o.file = m.file;
            return o;
        });
        let array = asts;
        if (argv.validate) {
            asts = yield Promise.all(asts.map(m => passes_1.passes(m)));
        }
        if (argv.pretty) {
            array = asts.map(m => m.toJSON(true, argv.trace));
        }
        let text = '';
        if (argv.json) {
            text = JSON.stringify(array.length > 1 ? array : array[0], null, 2);
        }
        else {
            text = util_1.inspect(array.length > 1 ? array : array[0], false, 20, !argv.output);
        }
        let output = process.stdout;
        if (argv.output) {
            output = fs.createWriteStream(argv.output);
        }
        output.write(text);
        if (output !== process.stdout) {
            output.close();
        }
    });
}
function run() {
    let argv = yargs.command({
        command: 'ast <files...>',
        builder: (y) => y.option('json', {
            default: false,
            type: 'boolean'
        }).option('output', {
            alias: ['o'],
            type: 'string'
        }).option('pretty', {
            alias: ['p'],
            type: 'boolean',
            default: false
        }).option('validate', {
            alias: 'v',
            type: 'boolean',
            default: false
        }).option('trace', {
            alias: 't',
            type: 'boolean',
            default: false
        }),
        handler: (argv) => {
            createAst(argv).catch(e => {
                console.error(e.message);
            });
        }
    })
        .help();
    generate_1.generateCommand(argv);
    argv.argv;
}
exports.run = run;
