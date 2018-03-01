export * from './user-values';
export * from './import';
import { ContextExpression } from '../expressions';
export declare class PassVisitorError extends Error {
    passes: {
        [key: string]: Error;
    };
    constructor(passes: {
        [key: string]: Error;
    });
    readonly message: string;
}
export declare function passes(e: ContextExpression): Promise<ContextExpression>;
