import { AbstractExpressionVisitor } from '../visitor';
import { Expression, ImportExpression, TemplateExpression, RawExpression, LoopExpression, ConditionalExpression, ArithmeticExpression, OperationExpression, LiteralExpression, FunctionCallExpression, TenaryExpression, BlockExpression, CommentExpression, PropertyExpression, AssignmentExpression, VariableExpression, PrimitiveExpression, AccessorExpression, BodyExpression, ContextExpression, ParameterExpression, CustomTypeExpression, ArrayTypeExpression, UserTypeExpression } from '../expressions';
import { ExpressionPosition } from '../template_parser';
import { PassVisitor } from './common';
export declare class SemanticError extends Error {
    location: ExpressionPosition;
    message: string;
    constructor(location: ExpressionPosition, message: string);
}
export declare class UserValueVisitor extends AbstractExpressionVisitor implements PassVisitor {
    resolves: AccessorExpression[];
    types: CustomTypeExpression[];
    templates: TemplateExpression[];
    scope: {
        [key: string]: any;
    };
    first: boolean;
    name: string;
    parse(e: ContextExpression): Promise<ContextExpression>;
    visit(e: Expression): any;
    visitTemplateExpression(e: TemplateExpression): TemplateExpression;
    visitAssignmentExpression(e: AssignmentExpression): AssignmentExpression;
    visitRawExpression(e: RawExpression): RawExpression;
    visitLoopExpression(e: LoopExpression): LoopExpression;
    visitConditionalExpression(e: ConditionalExpression): ConditionalExpression;
    visitArithmeticExpression(e: ArithmeticExpression): ArithmeticExpression;
    visitBinaryOperationExpression(e: OperationExpression): OperationExpression;
    visitLiteralExpression(e: LiteralExpression): LiteralExpression;
    visitFunctionCallExpression(e: FunctionCallExpression): FunctionCallExpression;
    visitTenaryExpression(e: TenaryExpression): TenaryExpression;
    visitBlockExpression(e: BlockExpression): BlockExpression;
    visitCommentExpression(e: CommentExpression): CommentExpression;
    visitContextExpression(e: ContextExpression): ContextExpression;
    visitPropertyExpression(e: PropertyExpression): PropertyExpression;
    visitPrimitiveExpression(e: PrimitiveExpression): PrimitiveExpression;
    visitAccessor(e: AccessorExpression): AccessorExpression;
    visitBody(e: BodyExpression): BodyExpression;
    visitCustomType(e: CustomTypeExpression): CustomTypeExpression;
    visitParamterType(e: ParameterExpression): ParameterExpression;
    visitArrayType(e: ArrayTypeExpression): ArrayTypeExpression;
    visitUserType(e: UserTypeExpression): UserTypeExpression;
    visitVariable(e: VariableExpression): any;
    visitImport(e: ImportExpression): ImportExpression;
}
