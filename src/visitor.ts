import {
    Expression, TemplateExpression, RawExpression, LoopExpression,
    ConditionalExpression, ArithmeticExpression, OperationExpression,
    LiteralExpression, FunctionCallExpression, TenaryExpression, BlockExpression,
    CommentExpression, PropertyExpression, AssignmentExpression,
    PrimitiveExpression, AccessorExpression, BodyExpression, ContextExpression,
    ParameterExpression, CustomTypeExpression, ArrayTypeExpression, UserTypeExpression, VariableExpression, ImportExpression,
} from './expressions';
import { Primitive, Token } from './types';



export interface IExpressionVisitor {
    visit(expression: Expression): any;
    visitTemplateExpression(expression: TemplateExpression): any;
    visitRawExpression(expression: RawExpression): any;
    visitLoopExpression(expression: LoopExpression): any;
    visitConditionalExpression(expression: ConditionalExpression): any;
    visitArithmeticExpression(expression: ArithmeticExpression): any;
    visitBinaryOperationExpression(expression: OperationExpression): any;
    visitLiteralExpression(expression: LiteralExpression): any;
    visitFunctionCallExpression(expression: FunctionCallExpression): any;
    visitTenaryExpression(expression: TenaryExpression): any;
    visitBlockExpression(expression: BlockExpression): any;
    visitCommentExpression(expression: CommentExpression): any;
    visitContextExpression(expression: ContextExpression): any;
    visitPropertyExpression(expression: PropertyExpression): any;
    visitPrimitiveExpression(expression: PrimitiveExpression): any
    visitAssignmentExpression(expression: AssignmentExpression): any;

    //visitTagAssignmentExpression(expression: TagAssignmentExpression): any;
    //visitTagExpression(expression: TagExpression): any;

    visitAccessor(expression: AccessorExpression): any;
    visitBody(expresison: BodyExpression): any;
    //visitMixin(expression: MixinExpression): any;
    visitCustomType(expression: CustomTypeExpression): any;
    visitParamterType(expression: ParameterExpression): any;
    visitArrayType(expression: ArrayTypeExpression): any;
    visitUserType(expression: UserTypeExpression): any;
    visitVariable(expression: VariableExpression): any;
    visitImport(expression: ImportExpression): any;
}


export abstract class AbstractExpressionVisitor implements IExpressionVisitor {


    visit(expression: Expression) {

        switch (expression.nodeType) {
            case Token.Template: return this.visitTemplateExpression(expression as any);
            case Token.Comment: return this.visitCommentExpression(expression as any);
            case Token.Arithmetic: return this.visitArithmeticExpression(expression as any);
            case Token.Assignment: return this.visitAssignmentExpression(expression as any);
            case Token.Block: return this.visitBlockExpression(expression as any);
            case Token.Conditional: return this.visitConditionalExpression(expression as any);
            case Token.Context: return this.visitContextExpression(expression as any);
            case Token.FunctionCall: return this.visitFunctionCallExpression(expression as any);
            case Token.Literal: return this.visitLiteralExpression(expression as any);
            case Token.Loop: return this.visitLoopExpression(expression as any);
            case Token.Operation: return this.visitBinaryOperationExpression(expression as any);
            case Token.Primitive: return this.visitPrimitiveExpression(expression as any);
            case Token.Property: return this.visitPropertyExpression(expression as any);
            case Token.Raw: return this.visitRawExpression(expression as any);
            case Token.Accessor: return this.visitAccessor(expression as any);
            case Token.Body: return this.visitBody(expression as any);
            case Token.Parameter: return this.visitParamterType(expression as any);
            case Token.Array: return this.visitArrayType(expression as any);
            case Token.UserType: return this.visitUserType(expression as any);
            case Token.CustomType: return this.visitCustomType(expression as any);
            case Token.Variable: return this.visitVariable(expression as any);
            case Token.Import: return this.visitImport(expression as any);
            //case Token.Mixin: return this.visitMixin(expression as any);
            //case Token.Type: return this.visitType(expression as any);
            /*case Token.Tag: {
                if (expression instanceof TagAssignmentExpression) {
                    return this.visitTagAssignmentExpression(expression as any);
                }
                return this.visitTagExpression(expression as any);
            }*/
            case Token.Tenary: return this.visitTenaryExpression(expression as any);
            //case Token.Variable: return this.visitVariableExpression(expression as any);
        }
        console.log('no type ', expression);
    }

    abstract visitTemplateExpression(expression: TemplateExpression): any;
    abstract visitAssignmentExpression(expression: AssignmentExpression): any;
    abstract visitRawExpression(expression: RawExpression): any;
    abstract visitLoopExpression(expression: LoopExpression): any;
    abstract visitConditionalExpression(expression: ConditionalExpression): any;
    abstract visitArithmeticExpression(expression: ArithmeticExpression): any;
    abstract visitBinaryOperationExpression(expression: OperationExpression): any;
    abstract visitLiteralExpression(expression: LiteralExpression): any;
    abstract visitFunctionCallExpression(expression: FunctionCallExpression): any;
    abstract visitTenaryExpression(expression: TenaryExpression): any;
    abstract visitBlockExpression(expression: BlockExpression): any;
    abstract visitCommentExpression(expression: CommentExpression): any;
    abstract visitContextExpression(expression: ContextExpression): any;
    abstract visitPropertyExpression(expression: PropertyExpression): any;
    abstract visitPrimitiveExpression(expression: PrimitiveExpression): any;

    abstract visitAccessor(expression: AccessorExpression): any;
    abstract visitBody(expression: BodyExpression): any;
    abstract visitCustomType(expression: CustomTypeExpression): any;
    abstract visitParamterType(expression: ParameterExpression): any;
    abstract visitArrayType(expression: ArrayTypeExpression): any;
    abstract visitUserType(expression: UserTypeExpression): any;
    abstract visitVariable(expression: VariableExpression): any;
    abstract visitImport(expression: ImportExpression): any;
}


