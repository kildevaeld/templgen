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
function ucfirst(s) {
    return s[0].toUpperCase() + s.substring(1);
}
class GolangVisitor extends visitor_1.AbstractExpressionVisitor {
    constructor() {
        super(...arguments);
        //incontext = false;
        this.trim = false;
    }
    parse(expression, options) {
        this.options = options;
        let out = this.visit(expression);
        return `package ${this.options.package || 'template'}\n\n` + out;
    }
    visitBody(expression) {
        return expression.value.map(m => this.visit(m)).join('\n');
    }
    visitAccessor(expression) {
        return expression.names.map((m, i) => i !== 0 ? ucfirst(m) : m).join('.');
    }
    visitTemplateExpression(e) {
        let params = e.parameters.length ? e.parameters.map(m => this.visit(m)).join(', ') + ', ' : '';
        params += 'buf *bytes.Buffer';
        let out = [`func ${ucfirst(e.name)} (${params}) {`];
        out.push(this.visit(e.body));
        out.push('}');
        return out.join('\n');
    }
    visitAssignmentExpression(expression) {
        return this.write(expression.expression);
    }
    visitRawExpression(expression) {
        return this.write(expression);
    }
    visitLoopExpression(e) {
        let out = [];
        if (e.key)
            out.push(`for ${this.visit(e.key)}, ${this.visit(e.value)}`);
        else
            out.push('for _, ' + this.visit(e.value));
        out.push(` := range ${this.visit(e.iterator)} {\n`);
        out.push(this.visit(e.body));
        out.push('\n}');
        return out.join('');
    }
    visitConditionalExpression(expression) {
        let out = [`if ${this.visit(expression.expression)} {\n${this.visit(expression.body)}\n} `];
        if (expression.elif.length) {
            out.push(...expression.elif.map(m => `else if ${this.visit(m.expression)} { \n${this.visit(m.body)} \n } `));
        }
        if (expression.el) {
            out.push(`else {\n${this.visit(expression.el)}\n}`);
        }
        return out.join('') + '\n';
    }
    visitArithmeticExpression(expression) {
        if (isLiteralExp(expression.left) && expression.left.type == types_1.Primitive.Int &&
            isLiteralExp(expression.right) && expression.right.type == types_1.Primitive.Int) {
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
        switch (expression.type) {
            case types_1.Primitive.String: return `"${expression.value}"`;
            case types_1.Primitive.Int: return expression.value;
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
        let out = this.visit(expression.value);
        return out;
    }
    visitPropertyExpression(e) {
        return `${ucfirst(e.name)} ${this.visit(e.type)} `;
    }
    visitPrimitiveExpression(expression) {
        switch (expression.type) {
            case types_1.Primitive.Int: return "int";
            case types_1.Primitive.Float: return 'float';
            case types_1.Primitive.Boolean: return "bool";
            case types_1.Primitive.Date: return "time.Time";
            case types_1.Primitive.String: return 'string';
        }
    }
    visitCustomType(e) {
        let out = [`type ${ucfirst(e.name)} struct {\n`];
        out.push(e.properties.map(m => this.visit(m)).join('\n'));
        out.push('\n}\n');
        return out.join('');
    }
    visitParamterType(expression) {
        let iut = expression.type.nodeType === types_1.Token.UserType;
        return expression.name + (iut ? ' *' : ' ') + this.visit(expression.type);
    }
    visitArrayType(e) {
        return "[]" + this.visit(e.type);
    }
    visitUserType(expression) {
        return expression.name;
    }
    write(s) {
        if (!s)
            return '';
        let t;
        switch (s.nodeType) {
            case types_1.Token.Accessor:
                {
                    t = s.resolvedAs;
                    let key = this.visit(s);
                    switch (t.type) {
                        case types_1.Primitive.String:
                            return `buf.WriteString(${key})`;
                        case types_1.Primitive.Int:
                            return `hero.FormatInt(uint64(${key}), buf)`;
                        case types_1.Primitive.Float:
                            return `hero.FormatFloat(float64(${key}), buf)`;
                        case types_1.Primitive.Date:
                            return `buf.WriteString(${key}.Format(time.UnixDate))`;
                        case types_1.Primitive.Boolean:
                            return `hero.FormatBool(${key}, buf)`;
                    }
                }
                break;
            case types_1.Token.Raw:
                return "buf.WriteString(`" + trim(s.value) + "`)";
            case types_1.Token.FunctionCall: {
                let e = s;
                return `${ucfirst(e.name)}(${e.parameters.map(m => this.visit(m)).join(', ')}, buf)`;
            }
            default:
                throw new Error('write ' + s);
        }
    }
    visitVariable(e) {
        return e.value;
    }
}
exports.GolangVisitor = GolangVisitor;