import { ContextExpression } from '../expressions';
export declare type PassVisitorConstructor = new () => PassVisitor;
export interface PassVisitor {
    readonly name: string;
    parse(e: ContextExpression): Promise<ContextExpression>;
}
