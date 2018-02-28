"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressions_1 = require("../expressions");
const types_1 = require("../types");
const visitor_1 = require("../visitor");
function isLiteralExp(a) {
    return a instanceof expressions_1.LiteralExpression;
}
function trim(s) {
    return s.replace(/\s+$/, "");
}
class TypescriptVisitor extends visitor_1.AbstractExpressionVisitor {
    constructor() {
        super(...arguments);
        this.incontext = false;
        this.trim = false;
    }
    visitType(expression) {
        throw new Error("Method not implemented.");
    }
    visitMixin(expression) {
        throw new Error("Method not implemented.");
    }
    visitBody(expression) {
        return expression.body.map(m => this.visit(m)).join('\n');
    }
    visitAccessor(expression) {
        if (this.incontext)
            return expression.names.join('.');
        return "ctx." + expression.names.join('.');
    }
    visitTemplateExpression(expression) {
        let forEach = `const __fe = (a:any, fn:any) => { let o = "", e; if (Array.isArray(a)) { for (let i = 0, ii = a.length; i < ii; i++) { if ((e = fn(i, a[i]))) o += e;  } } else { for (let k in a) { o += fn(k, a[k]); }} return o; }`;
        let wrap = `const __wrap = (fn:any,ctx:any) => { let r = fn(ctx); if (r!==""&&r!=null) { return r; } return ""; };`;
        let out = `${wrap}\n${forEach}\nexport function template(ctx: any) {\n  let __o = "";\n`;
        let o = expression.expressions.body.map(m => this.visit(m));
        out += o.join('\n') + '\nreturn __o;\n};\n';
        return out;
    }
    visitAssignmentExpression(expression) {
        if (expression.declaring) {
            return `let ${expression.name} = $; `;
        }
    }
    visitTagAssignmentExpression(expression) {
        if (this.incontext)
            return this.visit(expression.expression);
        return "__o += " + this.visit(expression.expression);
    }
    visitTagExpression(expression) {
        throw new Error("Method not implemented.");
    }
    visitRawExpression(expression) {
        if (this.incontext)
            return "`" + (this.trim ? trim(expression.value) : '') + "`";
        return '__o += ' + "`" + expression.value + "`;";
    }
    visitLoopExpression(e) {
        let out = [];
        out.push(`__o += __fe(${this.visit(e.iterator)}, (${e.key ? e.key.name : '_'}, ${e.value.name}) => `);
        this.incontext = true;
        this.trim = true;
        out.push(e.body.body.map(m => this.visit(m)).join('+'));
        out.push(`);`);
        this.incontext = false;
        this.trim = false;
        return out.join('');
    }
    visitConditionalExpression(expression) {
        let out = [`if (${this.visit(expression.expression)}) { \n${this.incontext ? 'return' : ''} ${this.visit(expression.body)} \n } `];
        if (expression.elif.length) {
            out.push(...expression.elif.map(m => `else if (${this.visit(m.expression)}) { \n${this.incontext ? 'return' : ''} ${this.visit(m.body)} \n } `));
        }
        if (expression.el) {
            out.push(`else {\n${this.incontext ? 'return' : ''} ${this.visit(expression.el)}\n}`);
            //out.push(`else { \n${expression.el.body.map(m => this.visit(m))} \n } `)
        }
        if (this.incontext) {
            out = ["__wrap(() => {"].concat(out).concat(['}, ctx)']);
        }
        return out.join('') + '\n';
    }
    visitVariableExpression(expression) {
        console.log(expression);
        return expression.name;
    }
    visitArithmeticExpression(expression) {
        if (isLiteralExp(expression.left) && expression.left.literalType == types_1.LiteralType.Number &&
            isLiteralExp(expression.right) && expression.right.literalType == types_1.LiteralType.Number) {
            return expression.left.value + expression.right.value;
        }
        let o = (function () {
            switch (expression.operator) {
                case types_1.MathOperator.Add: return "+";
                case types_1.MathOperator.Div: return "/";
                case types_1.MathOperator.Mod: return "%";
                case types_1.MathOperator.Mul: return "*";
                case types_1.MathOperator.Sub: return "-";
            }
        })();
        return this.visit(expression.left) + ` ${o} ` + this.visit(expression.right);
    }
    visitBinaryOperationExpression(expression) {
        let out = [this.visit(expression.left)];
        out.push((function () {
            switch (expression.operator) {
                case types_1.Operator.Eq: return "==";
                case types_1.Operator.Gt: return ">";
                case types_1.Operator.Gte: return ">=";
                case types_1.Operator.Lt: return "<";
                case types_1.Operator.Lte: return "<=";
                case types_1.Operator.Mod: return "%";
                case types_1.Operator.Neq: return "!=";
            }
        })());
        out.push(this.visit(expression.right));
        return out.join(' ');
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
