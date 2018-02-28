"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressions_1 = require("./expressions");
const types_1 = require("./types");
class AbstractExpressionVisitor {
    parse(expression) {
        return this.visit(expression);
    }
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
            case types_1.Token.Tag: {
                if (expression instanceof expressions_1.TagAssignmentExpression) {
                    return this.visitTagAssignmentExpression(expression);
                }
                return this.visitTagExpression(expression);
            }
            case types_1.Token.Tenary: return this.visitTenaryExpression(expression);
            case types_1.Token.Variable: return this.visitVariableExpression(expression);
        }
    }
    visitTemplateExpression(expression) {
        return expression.expressions.map(m => this.visit(m));
    }
}
exports.AbstractExpressionVisitor = AbstractExpressionVisitor;
