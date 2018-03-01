"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class AbstractExpressionVisitor {
    visit(expression) {
        switch (expression.nodeType) {
            case types_1.Token.Template: return this.visitTemplateExpression(expression);
            case types_1.Token.Comment: return this.visitCommentExpression(expression);
            case types_1.Token.Arithmetic: return this.visitArithmeticExpression(expression);
            case types_1.Token.Assignment: return this.visitAssignmentExpression(expression);
            case types_1.Token.Block: return this.visitBlockExpression(expression);
            case types_1.Token.Conditional: return this.visitConditionalExpression(expression);
            case types_1.Token.Context: return this.visitContextExpression(expression);
            case types_1.Token.FunctionCall: return this.visitFunctionCallExpression(expression);
            case types_1.Token.Literal: return this.visitLiteralExpression(expression);
            case types_1.Token.Loop: return this.visitLoopExpression(expression);
            case types_1.Token.Operation: return this.visitBinaryOperationExpression(expression);
            case types_1.Token.Primitive: return this.visitPrimitiveExpression(expression);
            case types_1.Token.Property: return this.visitPropertyExpression(expression);
            case types_1.Token.Raw: return this.visitRawExpression(expression);
            case types_1.Token.Accessor: return this.visitAccessor(expression);
            case types_1.Token.Body: return this.visitBody(expression);
            case types_1.Token.Parameter: return this.visitParamterType(expression);
            case types_1.Token.Array: return this.visitArrayType(expression);
            case types_1.Token.UserType: return this.visitUserType(expression);
            case types_1.Token.CustomType: return this.visitCustomType(expression);
            case types_1.Token.Variable: return this.visitVariable(expression);
            case types_1.Token.Import: return this.visitImport(expression);
            //case Token.Mixin: return this.visitMixin(expression as any);
            //case Token.Type: return this.visitType(expression as any);
            /*case Token.Tag: {
                if (expression instanceof TagAssignmentExpression) {
                    return this.visitTagAssignmentExpression(expression as any);
                }
                return this.visitTagExpression(expression as any);
            }*/
            case types_1.Token.Tenary: return this.visitTenaryExpression(expression);
        }
        console.log('no type ', expression);
    }
}
exports.AbstractExpressionVisitor = AbstractExpressionVisitor;
