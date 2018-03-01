export * from './user-values';
import { ContextExpression } from '../expressions';
import { PassVisitor, PassVisitorConstructor } from './common';
import { UserValueVisitor } from './user-values';

const _passes: PassVisitorConstructor[] = [
    UserValueVisitor
]

export async function passes(e: ContextExpression) {

    let copy = e.copy();

    let errors: { [key: string]: Error } = {};

    let tmp: PassVisitor;
    for (let i = 0, ii = _passes.length; i < ii; i++) {
        tmp = new _passes[i]
        try {
            copy = await tmp.parse(copy)
        } catch (e) {
            errors[tmp.name] = e;
        }
    }

    return copy;
}