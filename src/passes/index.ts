export * from './user-values';
import { ContextExpression } from '../expressions';

import { UserValueVisitor } from './user-values';

export function passes(e: ContextExpression) {

    let copy = e.copy();
    console.log(copy.value === e.value);

}