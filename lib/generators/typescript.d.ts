import { Expression, TemplateExpression, RawExpression, LoopExpression, ConditionalExpression, ArithmeticExpression, ImportExpression, OperationExpression, LiteralExpression, FunctionCallExpression, TenaryExpression, BlockExpression, CommentExpression, UserTypeExpression, ContextExpression, PropertyExpression, AssignmentExpression, PrimitiveExpression, AccessorExpression, BodyExpression, CustomTypeExpression, ParameterExpression, ArrayTypeExpression, VariableExpression } from '../expressions';
import { AbstractExpressionVisitor } from '../visitor';
import { Options } from './options';
export interface TypeScriptOptions extends Options {
    package: string;
}
export declare class TypescriptVisitor extends AbstractExpressionVisitor {
    options: TypeScriptOptions | undefined;
    current?: ContextExpression;
    parse(expression: ContextExpression, options: TypeScriptOptions): string;
    visitBody(expression: BodyExpression): string;
    trim: boolean;
    visitAccessor(expression: AccessorExpression): string;
    visitTemplateExpression(e: TemplateExpression): string;
    visitAssignmentExpression(e: AssignmentExpression): string;
    visitRawExpression(expression: RawExpression): string;
    visitLoopExpression(e: LoopExpression): string;
    visitConditionalExpression(expression: ConditionalExpression): string;
    visitArithmeticExpression(expression: ArithmeticExpression): string;
    visitBinaryOperationExpression(expression: OperationExpression): string;
    visitLiteralExpression(expression: LiteralExpression): string | undefined;
    visitFunctionCallExpression(expression: FunctionCallExpression): string;
    visitTenaryExpression(expression: TenaryExpression): void;
    visitBlockExpression(expression: BlockExpression): void;
    visitCommentExpression(expression: CommentExpression): string;
    visitContextExpression(expression: ContextExpression): any;
    visitPropertyExpression(e: PropertyExpression): string;
    visitPrimitiveExpression(expression: PrimitiveExpression): "string" | "number" | "boolean" | "Date";
    visitCustomType(e: CustomTypeExpression): string;
    visitParamterType(expression: ParameterExpression): string;
    visitArrayType(e: ArrayTypeExpression): any;
    visitUserType(expression: UserTypeExpression): string;
    write(s: Expression, escape?: boolean): string;
    visitVariable(e: VariableExpression): any;
    visitImport(e: ImportExpression): any;
}
