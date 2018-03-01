import {
    Expression, TemplateExpression, RawExpression, LoopExpression,
    ConditionalExpression, ArithmeticExpression,
    OperationExpression, LiteralExpression, FunctionCallExpression,
    TenaryExpression, BlockExpression, CommentExpression, TypeExpression, UserTypeExpression,
    ContextExpression, PropertyExpression, AssignmentExpression, PrimitiveExpression,
    AccessorExpression, BodyExpression, CustomTypeExpression, ParameterExpression, ArrayTypeExpression, VariableExpression,
} from '../expressions';
import { Primitive, Token, Operator, MathOperator } from '../types';
import { AbstractExpressionVisitor } from '../visitor';
import { Options } from './options';

function isLiteralExp(a: any): a is LiteralExpression {
    return a instanceof LiteralExpression
}

function trim(s: string) {
    return s.replace(/\s+$/, "");
}

function ucfirst(s: string) {
    return s[0].toUpperCase() + s.substring(1);
}

export interface GolangOptions extends Options {
    package: string;

}

export class GolangVisitor extends AbstractExpressionVisitor {


    options: GolangOptions | undefined;

    parse(expression: ContextExpression, options: GolangOptions) {
        this.options = options;

        let out = this.visit(expression);
        return `package ${this.options.package || 'template'}\n\n` + out;
    }

    visitBody(expression: BodyExpression) {
        return expression.value.map(m => this.visit(m)).join('\n');
    }
    //incontext = false;
    trim = false;
    visitAccessor(expression: AccessorExpression) {
        return expression.names.map((m, i) => i !== 0 ? ucfirst(m) : m).join('.');
    }


    visitTemplateExpression(e: TemplateExpression) {


        let params = e.parameters.length ? e.parameters.map(m => this.visit(m)).join(', ') + ', ' : ''
        params += 'buf *bytes.Buffer';

        let out = [`func ${ucfirst(e.name)} (${params}) {`]


        out.push(this.visit(e.body));

        out.push('}')

        return out.join('\n');
    }

    visitAssignmentExpression(expression: AssignmentExpression) {
        return this.write(expression.expression);
    }


    visitRawExpression(expression: RawExpression) {
        return this.write(expression);
    }

    visitLoopExpression(e: LoopExpression) {
        let out = [];
        if (e.key) out.push(`for ${this.visit(e.key)}, ${this.visit(e.value)}`);
        else out.push('for _, ' + this.visit(e.value));
        out.push(` := range ${this.visit(e.iterator)} {\n`);
        out.push(this.visit(e.body))
        out.push('\n}');
        return out.join('');
    }
    visitConditionalExpression(expression: ConditionalExpression) {

        let out = [`if ${this.visit(expression.expression)} {\n${this.visit(expression.body)}\n} `];

        if (expression.elif.length) {
            out.push(...expression.elif.map(m => `else if ${this.visit(m.expression!)} { \n${this.visit(m.body)} \n } `))
        }

        if (expression.el) {
            out.push(`else {\n${this.visit(expression.el)}\n}`)
        }


        return out.join('') + '\n';

    }


    visitArithmeticExpression(expression: ArithmeticExpression) {
        if (isLiteralExp(expression.left) && expression.left.type == Primitive.Int &&
            isLiteralExp(expression.right) && expression.right.type == Primitive.Int
        ) {
            return expression.left.value + expression.right.value;
        }

        let o = (function () {
            switch (expression.operator) {
                case MathOperator.Add: return "+";
                case MathOperator.Div: return "/";
                case MathOperator.Mod: return "%";
                case MathOperator.Mul: return "*";
                case MathOperator.Sub: return "-";
            }
        })();

        return this.visit(expression.left) + ` ${o} ` + this.visit(expression.right);

    }
    visitBinaryOperationExpression(expression: OperationExpression) {

        let out = [this.visit(expression.left)];
        out.push((function () {
            switch (expression.operator) {
                case Operator.Eq: return "==";
                case Operator.Gt: return ">";
                case Operator.Gte: return ">=";
                case Operator.Lt: return "<";
                case Operator.Lte: return "<=";
                case Operator.Mod: return "%";
                case Operator.Neq: return "!=";
            }
        })())

        out.push(this.visit(expression.right));

        return out.join(' ');
    }
    visitLiteralExpression(expression: LiteralExpression) {
        switch (expression.type) {
            case Primitive.String: return `"${expression.value}"`;
            case Primitive.Int: return expression.value;
        }
    }

    visitFunctionCallExpression(expression: FunctionCallExpression) {
        return `${expression.name} (${(expression.parameters || []).map(m => this.visit(m))}) `;
    }
    visitTenaryExpression(expression: TenaryExpression) {
        throw new Error("Method not implemented.");
    }
    visitBlockExpression(expression: BlockExpression) {
        throw new Error("Method not implemented.");
    }
    visitCommentExpression(expression: CommentExpression) {
        return `/*\n${expression.comment}\n*/`;
    }
    visitContextExpression(expression: ContextExpression) {
        let out = this.visit(expression.value);
        return out;
    }
    visitPropertyExpression(e: PropertyExpression) {
        return `${ucfirst(e.name)} ${this.visit(e.type)} `
    }
    visitPrimitiveExpression(expression: PrimitiveExpression) {
        switch (expression.type) {
            case Primitive.Int: return "int"
            case Primitive.Float: return 'float';
            case Primitive.Boolean: return "bool";
            case Primitive.Date: return "time.Time";
            case Primitive.String: return 'string';
        }
    }

    visitCustomType(e: CustomTypeExpression) {
        let out = [`type ${ucfirst(e.name)} struct {\n`];
        out.push(e.properties.map(m => this.visit(m)).join('\n'));
        out.push('\n}\n')
        return out.join('');
    }
    visitParamterType(expression: ParameterExpression) {
        let iut = expression.type.nodeType === Token.UserType;
        return expression.name + (iut ? ' *' : ' ') + this.visit(expression.type);
    }

    visitArrayType(e: ArrayTypeExpression): any {
        return "[]" + this.visit(e.type);
    }

    visitUserType(expression: UserTypeExpression) {
        return expression.name;
    }


    write(s: Expression) {
        if (!s) return '';
        let t: Expression | undefined;

        switch (s.nodeType) {
            case Token.Accessor: {
                t = (s as AccessorExpression).resolvedAs!;
                let key = this.visit(s);

                switch ((t as PrimitiveExpression).type) {
                    case Primitive.String:
                        return `buf.WriteString(${key})`;
                    case Primitive.Int:
                        return `hero.FormatInt(uint64(${key}), buf)`
                    case Primitive.Float:
                        return `hero.FormatFloat(float64(${key}), buf)`
                    case Primitive.Date:
                        return `buf.WriteString(${key}.Format(time.UnixDate))`
                    case Primitive.Boolean:
                        return `hero.FormatBool(${key}, buf)`
                }
            } break;
            case Token.Raw:
                return "buf.WriteString(`" + trim((s as RawExpression).value) + "`)"
            case Token.FunctionCall: {
                let e = (s as FunctionCallExpression);
                return `${ucfirst(e.name)}(${e.parameters.map(m => this.visit(m)).join(', ')}, buf)`
            }
            default:
                throw new Error('write ' + s);
        }


    }

    visitVariable(e: VariableExpression): any {
        return e.value;
    }

}