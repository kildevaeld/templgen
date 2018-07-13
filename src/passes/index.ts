export * from './user-values';
export * from './import';

import { ContextExpression } from '../expressions';
import { PassVisitor, PassVisitorConstructor } from './common';
import { UserValueVisitor } from './user-values';
import { ImportPass } from './import';
import { uniqueID } from '../utils';

const _passes: PassVisitorConstructor[] = [
    ImportPass,
    UserValueVisitor
]

export class PassVisitorError extends Error {
    constructor(public passes: { [key: string]: Error }) {
        super();
        Object.setPrototypeOf(this, PassVisitorError.prototype);
    }

    get message() {
        let str: string[] = [];

        for (let k in this.passes) {
            str.push(`${k}: ${this.passes[k].message}`);
        }

        return str.join('')
    }
}

export async function passes(e: ContextExpression) {

    let copy = e.copy();
    copy.id = uniqueID();

    let errors: { [key: string]: Error } = {};

    let tmp: PassVisitor;
    for (let i = 0, ii = _passes.length; i < ii; i++) {
        tmp = new _passes[i]
        try {
            copy = await tmp.parse(copy)
        } catch (e) {
            throw e;
            errors[tmp.name] = e;
        }
    }


    if (Object.keys(errors).length) {
        throw new PassVisitorError(errors);
    }

    return copy;
}