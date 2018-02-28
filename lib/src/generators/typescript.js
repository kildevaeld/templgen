"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressions_1 = require("../expressions");
const types_1 = require("../types");
const visitor_1 = require("../visitor");
function isLiteralExp(a) {
    return a instanceof expressions_1.LiteralExpression;
}
class TypescriptVisitor extends visitor_1.AbstractExpressionVisitor {
    constructor() {
        super(...arguments);
        this.incontext = false;
    }
    visitAccessor(expression) {
        if (this.incontext)
            return expression.names.join('.');
        return "ctx." + expression.names.join('.');
    }
    visitTemplateExpression(expression) {
        let forEach = `const __forEach = (a:any, fn:any) => { if (Array.isArray(a)) { a.forEach(fn) } else { for (let k in a) { fn(k, a[k])}}}`;
        let out = `${forEach}\nexport function template(ctx: any) {\n  let __out = "";\n`;
        out += super.visitTemplateExpression(expression).join('\n');
        out += '};\n';
        return out;
    }
    visitAssignmentExpression(expression) {
        if (expression.declaring) {
            return `let ${expression.name} = $; `;
        }
    }
    visitTagAssignmentExpression(expression) {
        return "__out += " + this.visit(expression.expression);
    }
    visitTagExpression(expression) {
        console.log(expression);
        throw new Error("Method not implemented.");
    }
    /*visitTemplateExpression(expression: TemplateExpression) {
        throw new Error("Method not implemented.");
    }*/
    visitRawExpression(expression) {
        return '__out += ' + "`" + expression.value + "`";
    }
    visitLoopExpression(e) {
        let out = [];
        out.push(`__forEach(${this.visit(e.iterator)}, (${e.key ? e.key.name : '_'}, ${e.value.name}) => {`);
        this.incontext = true;
        out.push(e.body.map(m => this.visit(m)).join('\n'));
        out.push(`});`);
        this.incontext = false;
        return out.join('');
    }
    visitConditionalExpression(expression) {
        let out = [`if (${this.visit(expression.expression)}) { \n${expression.body.map(m => this.visit(m))} \n } `];
        if (expression.elif.length) {
            out.push(...expression.elif.map(m => `else if (${this.visit(m.expression)}) { \n${m.body.map(m => this.visit(m))} \n } `));
        }
        if (expression.el) {
            out.push(`else { \n${expression.el.body.map(m => this.visit(m))} \n } `);
        }
        return out.join('') + '\n';
    }
    visitVariableExpression(expression) {
        return expression.name;
    }
    visitArithmeticExpression(expression) {
        if (isLiteralExp(expression.left) && expression.left.literalType == types_1.LiteralType.Number &&
            isLiteralExp(expression.right) && expression.right.literalType == types_1.LiteralType.Number) {
            return expression.left.value + expression.right.value;
        }
        return this.visit(expression.left) + ' + ' + this.visit(expression.right);
    }
    visitBinaryOperationExpression(expression) {
        throw new Error("Method not implemented.");
    }
    visitLiteralExpression(expression) {
        switch (expression.literalType) {
            case types_1.LiteralType.String: return `"${expression.value}"`;
            case types_1.LiteralType.Number: return expression.value;
        }
    }
    visitFunctionCallExpression(expression) {
        return `${expression.name} (${(expression.parameters || []).map(m => this.visit(m))}) `;
    }
    visitTenaryExpression(expression) {
        throw new Error("Method not implemented.");
    }
    visitBlockExpression(expression) {
        throw new Error("Method not implemented.");
    }
    visitCommentExpression(expression) {
        return `/*\n${expression.comment}\n*/`;
    }
    visitContextExpression(expression) {
        throw new Error("Method not implemented.");
    }
    visitPropertyExpression(expression) {
        return `${expression.name}: ${this.visit(expression.type)} `;
    }
    visitPrimitiveExpression(expression) {
        switch (expression.type) {
            case types_1.Primitive.Int:
            case types_1.Primitive.Float: return 'number';
            case types_1.Primitive.String: return 'string';
        }
    }
}
exports.TypescriptVisitor = TypescriptVisitor;
