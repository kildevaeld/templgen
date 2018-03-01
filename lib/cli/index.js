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
function createAst(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = argv.files;
        const data = yield Promise.all(files.map(m => fs.readFile(m)));
        let asts = data.map(m => template_parser_1.parse(m.toString()));
        if (argv.validate) {
            asts = yield Promise.all(asts.map(m => passes_1.passes(m)));
        }
        if (argv.pretty) {
            asts = asts.map(m => m.toJSON(false, true));
        }
        let text = '';
        if (argv.json) {
            text = JSON.stringify(asts.length > 1 ? asts : asts[0], null, 2);
        }
        else {
            text = util_1.inspect(asts.length > 1 ? asts : asts[0], false, 20, !argv.output);
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
        }),
        handler: (argv) => {
            createAst(argv);
        }
    })
        .help()
        .argv;
}
exports.run = run;
