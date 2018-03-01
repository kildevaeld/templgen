
import { PassVisitor } from './common';
import { parse } from '../template_parser';
import { ContextExpression, ImportExpression } from '../expressions';
import { Token } from '../types';
import * as Path from 'path';
import * as fs from 'mz/fs';
import { uniqueID } from '../utils';

export class MultiError extends Error {
    name = "MultiError"
    constructor(public errors: Error[], message?: string) {
        super();
        Object.setPrototypeOf(this, MultiError.prototype);
    }

    get message() {
        let str = [''];

        for (let error of this.errors) {
            str.push(' * ' + error.message);
        }
        return str.join('\n');
    }

    toString() { return this.message }

}

export class ImportPass implements PassVisitor {
    name = "Import"
    async parse(e: ContextExpression): Promise<ContextExpression> {

        let copy = e.copy();
        await this.resolveImport(copy, null);

        return copy;

    }

    async resolveImport(e: ContextExpression, p: ContextExpression | null) {
        if (!e.file) throw new Error('no file');

        let imports: ImportExpression[] = e.value.value.filter(m => m.nodeType == Token.Import) as any;

        for (let ee of e.value.value) {
            if (~[Token.Template, Token.CustomType].indexOf(ee.nodeType)) {
                (ee as any).contextId = e.id;
            }
        }

        if (!imports.length) return e;

        const resolvePath = Path.dirname(e.file!);

        let errors: Error[] = []
        for (let i of imports) {
            let path = Path.join(resolvePath, i.path)
            if (p && path === e.file) {
                errors.push(new Error('circle import'))
                continue;
            }
            try {
                const data = await fs.readFile(path, 'utf-8');
                const ast = parse(data);
                ast.file = path;
                ast.id = uniqueID();

                await this.resolveImport(ast, e);

                e.imports.push(ast);

            } catch (e) {
                errors.push(e);
            }


        }

        if (errors.length) throw new MultiError(errors, "import");


    }
} 