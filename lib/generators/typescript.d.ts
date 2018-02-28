import { TemplateExpression, RawExpression, LoopExpression, ConditionalExpression, VariableExpression, ArithmeticExpression, OperationExpression, LiteralExpression, FunctionCallExpression, TenaryExpression, BlockExpression, CommentExpression, MixinExpression, TypeExpression, ContextExpression, PropertyExpression, AssignmentExpression, TagAssignmentExpression, TagExpression, PrimitiveExpression, AccessorExpression, BodyExpression } from '../expressions';
import { AbstractExpressionVisitor } from '../visitor';
export declare class TypescriptVisitor extends AbstractExpressionVisitor {
    visitType(expression: TypeExpression): void;
    visitMixin(expression: MixinExpression): void;
    visitBody(expression: BodyExpression): any;
    incontext: boolean;
    trim: boolean;
    visitAccessor(expression: AccessorExpression): string;
    visitTemplateExpression(expression: TemplateExpression): string;
    visitAssignmentExpression(expression: AssignmentExpression): string | undefined;
    visitTagAssignmentExpression(expression: TagAssignmentExpression): any;
    visitTagExpression(expression: TagExpression): void;
    visitRawExpression(expression: RawExpression): string;
    visitLoopExpression(e: LoopExpression): string;
    visitConditionalExpression(expression: ConditionalExpression): string;
    visitVariableExpression(expression: VariableExpression): any;
    visitArithmeticExpression(expression: ArithmeticExpression): string;
    visitBinaryOperationExpression(expression: OperationExpression): string;
    visitLiteralExpression(expression: LiteralExpression): string | undefined;
    visitFunctionCallExpression(expression: FunctionCallExpression): string;
    visitTenaryExpression(expression: TenaryExpression): void;
    visitBlockExpression(expression: BlockExpression): void;
    visitCommentExpression(expression: CommentExpression): string;
    visitContextExpression(expression: ContextExpression): void;
    visitPropertyExpression(expression: PropertyExpression): string;
    visitPrimitiveExpression(expression: PrimitiveExpression): "string" | "number" | undefined;
}
