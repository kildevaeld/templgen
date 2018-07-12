import * as yargs from 'yargs';
import { GolangVisitor } from '../generators/golang';
import { TypescriptVisitor } from '../generators/typescript';
import * as Path from 'path';
import * as fs from 'mz/fs';
import { parse } from '../template_parser';
import { passes } from '../passes';

async function generateFiles(argv: yargs.Arguments) {
    let files = argv.files as string[];

    if (argv.name != 'golang' && argv.name != 'typescript') {
        throw new Error('could not find generator');
    }

    const data = await Promise.all<{ file: string; buffer: Buffer }>(files.map((m: string) => fs.readFile(m).then(buf => ({
        file: Path.resolve(m),
        buffer: buf
    }))));

    let asts = data.map(m => {
        let o = parse(m.buffer.toString());
        o.file = m.file;
        return o;
    });

    asts = await Promise.all(asts.map(m => passes(m)));

    let gen = argv.name === 'golang' ? new GolangVisitor : new TypescriptVisitor

    let output_data = asts.map(m => ({
        content: gen.parse(m, { package: 'template' }),
        ctx: m,
    }));


    let out = argv.output;
    for (let o of output_data) {
        let fn = Path.basename(o.ctx.file!) + '.go';
        if (!out) {
            process.stdout.write(`## ${fn}\n\n${o.content}\n`);
            continue;
        }
        let op = Path.join(Path.resolve(out), fn);
        await fs.writeFile(op, o.content);
    }


}


export function generateCommand(yargs: yargs.Argv) {

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