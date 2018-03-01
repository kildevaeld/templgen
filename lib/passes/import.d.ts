import { PassVisitor } from './common';
import { ContextExpression } from '../expressions';
export declare class MultiError extends Error {
    errors: Error[];
    name: string;
    constructor(errors: Error[], message?: string);
    readonly message: string;
    toString(): string;
}
export declare class ImportPass implements PassVisitor {
    name: string;
    parse(e: ContextExpression): Promise<ContextExpression>;
    resolveImport(e: ContextExpression, p: ContextExpression | null): Promise<ContextExpression | undefined>;
}
