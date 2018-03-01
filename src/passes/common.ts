import { ContextExpression } from '../expressions';
import { Context } from 'vm';

export type PassVisitorConstructor = new () => PassVisitor

export interface PassVisitor {
    readonly name: string;
    parse(e: ContextExpression): Promise<ContextExpression>;
}