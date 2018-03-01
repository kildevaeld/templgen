import * as yargs from 'yargs';
import * as fs from 'mz/fs';
import { parse } from '../template_parser';
import { inspect } from 'util';
import { Writable } from 'stream';
import { passes } from '../passes'
async function createAst(argv: yargs.Arguments) {
    let files = argv.files;
    const data = await Promise.all(files.map(m => fs.readFile(m)));
    let asts = data.map(m => parse(m.toString()));

    if (argv.validate) {
        let out = asts.map(m => passes(m));

        console.log(out)
        return;
    }

    if (argv.human) {
        asts = asts.map(m => m.toJSON(false, true))
    }

    let text: string = '';
    if (argv.json) {
        text = JSON.stringify(asts.length > 1 ? asts : asts[0], null, 2);
    } else {
        text = inspect(asts.length > 1 ? asts : asts[0], false, 20, !argv.output);
    }

    let output: Writable = process.stdout;
    if (argv.output) {
        output = fs.createWriteStream(argv.output);
    }

    output.write(text);

    if (output !== process.stdout) {
        (output as fs.WriteStream).close();
    }


}

export function run() {
    let argv = yargs.command({
        command: 'ast <files...>',
        builder: (y) => y.option('json', {
            default: false,
            type: 'boolean'
        }).option('output', {
            alias: ['o'],
            type: 'string'
        }).option('human', {
            type: 'boolean',
            default: false
        }).option('validate', {
            alias: 'v',
            default: false
        }),
        handler: (argv) => {
            createAst(argv);
        }
    })
        .help()
        .argv;



}