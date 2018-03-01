import { Expression, TemplateExpression, RawExpression, LoopExpression, ConditionalExpression, ArithmeticExpression, ImportExpression, OperationExpression, LiteralExpression, FunctionCallExpression, TenaryExpression, BlockExpression, CommentExpression, UserTypeExpression, ContextExpression, PropertyExpression, AssignmentExpression, PrimitiveExpression, AccessorExpression, BodyExpression, CustomTypeExpression, ParameterExpression, ArrayTypeExpression, VariableExpression } from '../expressions';
import { AbstractExpressionVisitor } from '../visitor';
import { Options } from './options';
export interface GolangOptions extends Options {
    package: string;
}
export declare class GolangVisitor extends AbstractExpressionVisitor {
    options: GolangOptions | undefined;
    parse(expression: ContextExpression, options: GolangOptions): string;
    visitBody(expression: BodyExpression): string;
    trim: boolean;
    visitAccessor(expression: AccessorExpression): string;
    visitTemplateExpression(e: TemplateExpression): string;
    visitAssignmentExpression(expression: AssignmentExpression): string | undefined;
    visitRawExpression(expression: RawExpression): string | undefined;
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
    visitPrimitiveExpression(expression: PrimitiveExpression): "string" | "int" | "float" | "bool" | "time.Time";
    visitCustomType(e: CustomTypeExpression): string;
    visitParamterType(expression: ParameterExpression): string;
    visitArrayType(e: ArrayTypeExpression): any;
    visitUserType(expression: UserTypeExpression): string;
    write(s: Expression): string | undefined;
    visitVariable(e: VariableExpression): any;
    visitImport(e: ImportExpression): any;
}
