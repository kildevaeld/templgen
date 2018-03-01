import * as yargs from 'yargs';
import * as fs from 'mz/fs';
import { parse } from '../template_parser';
import { inspect } from 'util';
import { Writable } from 'stream';
import { passes } from '../passes'
import * as Path from 'path';


async function createAst(argv: yargs.Arguments) {
    let files = argv.files;
    const data = await Promise.all<{ file: string; buffer: Buffer }>(files.map((m: string) => fs.readFile(m).then(buf => ({
        file: Path.resolve(m),
        buffer: buf
    }))));

    let asts = data.map(m => {
        let o = parse(m.buffer.toString());
        o.file = m.file;
        return o;
    });

    let array: any[] = asts;
    if (argv.validate) {
        asts = await Promise.all(asts.map(m => passes(m)));
    }

    if (argv.pretty) {
        array = asts.map(m => m.toJSON(true, argv.trace))
    }

    let text: string = '';
    if (argv.json) {
        text = JSON.stringify(array.length > 1 ? array : array[0], null, 2);
    } else {
        text = inspect(array.length > 1 ? array : array[0], false, 20, !argv.output);
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
            })
        }
    })
        .help()
        .argv;



}