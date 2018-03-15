import { AbstractExpressionVisitor } from '../visitor';
import {
    Expression, ImportExpression, TemplateExpression, RawExpression, LoopExpression,
    ConditionalExpression, ArithmeticExpression, OperationExpression,
    LiteralExpression, FunctionCallExpression, TenaryExpression, BlockExpression,
    CommentExpression, PropertyExpression, AssignmentExpression, VariableExpression,
    PrimitiveExpression, AccessorExpression, BodyExpression, ContextExpression,
    ParameterExpression, CustomTypeExpression, ArrayTypeExpression, UserTypeExpression,
} from '../expressions';
import { Token, Primitive } from '../types';
import { ExpressionPosition } from '../template_parser';
import { PassVisitor } from './common';
import { flatten } from '../utils';

export class SemanticError extends Error {
    constructor(public location: ExpressionPosition, public message: string) {
        super(message);
        Object.setPrototypeOf(this, SemanticError.prototype);
    }
}

export class UserValueVisitor extends AbstractExpressionVisitor implements PassVisitor {

    resolves: AccessorExpression[] = [];
    types: CustomTypeExpression[] = [];
    templates: TemplateExpression[] = [];
    scope: { [key: string]: any } = {};

    first = true;

    name = "Types";

    async parse(e: ContextExpression): Promise<ContextExpression> {
        e = this.visit(e);
        this.first = false;

        let types = flatten(e.imports.map(m => m.value.value.filter(m => m.nodeType === Token.CustomType))) as CustomTypeExpression[];
        this.types = this.types.concat(types);

        let templates = flatten(e.imports.map(m => m.value.value.filter(m => m.nodeType === Token.Template))) as TemplateExpression[];
        this.templates = this.templates.concat(templates);


        e = this.visit(e);

        return e;

    }

    visit(e: Expression) {
        if (!e) return e;
        return super.visit(e);
    }

    visitTemplateExpression(e: TemplateExpression) {

        e.parameters = e.parameters.map(m => this.visit(m));
        if (this.first)
            this.templates.push(e);
        else {
            for (let i of e.parameters) {
                this.scope[i.name] = i.type;
            }
        }

        e.body = this.visit(e.body);

        for (let i of e.parameters) {
            delete this.scope[i.name];
        }

        return e;
    }

    visitAssignmentExpression(e: AssignmentExpression) {
        e.expression = this.visit(e.expression);

        /*if (!this.first) {
            if (e.expression.nodeType === Token.UserType) {
                e.
            }
        }*/

        return e;
    }
    visitRawExpression(e: RawExpression) {
        return e;
    }
    visitLoopExpression(e: LoopExpression) {

        e.key = this.visit(e.key!);
        e.value = this.visit(e.value);

        e.iterator = this.visit(e.iterator);

        if (!this.first) {

            let type = (e.iterator as any).resolvedAs as Expression;

            if (!(type.nodeType == Token.Array || (type.nodeType == Token.Primitive))) {
                throw new Error('iterator is not a array');
            }
            if (e.key) {
                e.key.resolvedAs = new PrimitiveExpression(e.position, Primitive.Int);
                this.scope[e.key.value] = e.key.resolvedAs;
            }

            if (type instanceof ArrayTypeExpression) {
                e.value.resolvedAs = (type as ArrayTypeExpression).type as any;
            } else {
                e.value.resolvedAs = type as any;
            }


            this.scope[e.value.value] = e.value.resolvedAs;
        }



        e.body = this.visit(e.body);

        if (e.key) this.scope[e.key.value] = e.key.resolvedAs;
        this.scope[e.value.value] = e.value.resolvedAs;

        return e;
    }
    visitConditionalExpression(e: ConditionalExpression) {
        e.body = this.visit(e.body);
        e.el = e.el ? this.visit(e.el) : e.el;
        e.elif = e.elif.map(m => this.visit(m));
        e.expression = this.visit(e.expression);
        return e;
    }
    visitArithmeticExpression(e: ArithmeticExpression) {
        e.left = this.visit(e.left);
        e.right = this.visit(e.right);
        return e;
    }
    visitBinaryOperationExpression(e: OperationExpression) {
        return e;
    }
    visitLiteralExpression(e: LiteralExpression) {
        return e;
    }
    visitFunctionCallExpression(e: FunctionCallExpression) {
        e.parameters = e.parameters.map(m => this.visit(m));
        if (!this.first) {
            let templ = this.templates.find(m => m.name == e.name)
            if (!templ) {
                throw new SemanticError(e.position, 'invalid functioncal ' + e.name);
            }
            if (e.parameters.length !== templ.parameters.length) {
                throw new SemanticError(e.position, "invalid parameter count " + e.name);
            }

            for (let i = 0, ii = e.parameters.length; i < ii; i++) {
                let p1 = e.parameters[i],
                    p2 = templ.parameters[i].type;
                let pt1 = (p1 as any).resolvedAs || p1,
                    pt2 = (p2 as any).resolvedAs || p2;


                if (pt1.nodeType !== pt2.nodeType) {
                    throw new SemanticError(e.position, `invalid parameter at #${i}`);
                }

                switch (pt1.nodeType) {
                    case Token.Primitive: {
                        if (pt1.type !== pt2.type) {
                            throw new SemanticError(e.position, `invalid parameter at #${i}`);
                        }
                    } break;
                    case Token.CustomType: {
                        if (pt1.name !== pt2.name) {
                            throw new SemanticError(e.position, `invalid paramter at #${i}`);
                        }
                    } break;
                }
            }
            e.resolvedAs = templ;

        }
        return e;
    }
    visitTenaryExpression(e: TenaryExpression) {
        e.right = this.visit(e.right);
        e.left = this.visit(e.left);
        e.conditional = this.visit(e.conditional);

        return e
    }
    visitBlockExpression(e: BlockExpression) {
        e.body = this.visit(e.body);
        e.expression = e.expression ? this.visit(e.expression) : e.expression;
        return e;
    }
    visitCommentExpression(e: CommentExpression) {
        return e
    }
    visitContextExpression(e: ContextExpression) {
        e.value = this.visit(e.value);
        return e;
    }
    visitPropertyExpression(e: PropertyExpression) {
        e.type = this.visit(e.type);
        return e;
    }
    visitPrimitiveExpression(e: PrimitiveExpression) {
        return e
    }
    visitAccessor(e: AccessorExpression) {
        this.resolves.push(e);
        if (!this.first) {
            let len = e.names.length;
            let type: Expression | undefined;
            if (this.scope[e.names[0]]) {
                type = this.scope[e.names[0]]
            } else {
                throw new SemanticError(e.position, 'invalid accessor ' + e.names[0]);
            }


            var index = 0;
            if (type!.nodeType == Token.Array && len > 1 && e.names[1].match(/\d+/)) {
                type = (type as ArrayTypeExpression).type;
                if (len == 2) {
                    if (type instanceof UserTypeExpression)
                        type = type.resolvedAs;

                    e.resolvedAs = type instanceof PropertyExpression ? type.type : type;

                    return e;
                }
                index++;
            }
            if (type!.nodeType !== Token.UserType && len > 1) {
                throw new SemanticError(e.position, `cannot get ${e.names[1]} of ${e.names[0]}`);
            } else if (type!.nodeType == Token.UserType && len > 1) {
                let i = index;
                let ct = (type as UserTypeExpression).resolvedAs!;

                while (++i < len) {

                    if (e.names[i].match(/\d+/)) {
                        type = (type as PropertyExpression).type;

                        if (type.nodeType !== Token.Array) {
                            throw new Error('cannot index a non array value');
                        }
                        type = (type as ArrayTypeExpression).type;
                        if (type.nodeType == Token.UserType) {
                            this.visit(type)
                            ct = (type as any).resolvedAs
                        }

                    } else {
                        type = ct.properties.find(m => m.name == e.names[i]);
                    }

                    if (!type) {

                        throw new SemanticError(e.position, 'invalid type ' + e.names.slice(0, i + 1).join('.'));
                    }
                    if (type.nodeType == Token.CustomType)
                        ct = type as any;
                    else if (type.nodeType === Token.Array && i < len - 1 && e.names[i + 1].match(/\d+/)) {
                        type = (type as ArrayTypeExpression).type;
                        if (type.nodeType === Token.UserType)
                            ct = type as any;

                    }
                }
            }

            if (type instanceof UserTypeExpression)
                type = type.resolvedAs;

            e.resolvedAs = type instanceof PropertyExpression ? type.type : type;

            //if (type!.nodeType !== Token.)

        }
        return e;

    }
    visitBody(e: BodyExpression) {
        e.value = e.value.map(m => this.visit(m));
        return e;
    }
    visitCustomType(e: CustomTypeExpression) {
        e.properties = e.properties.map(m => this.visit(m));
        if (this.first)
            this.types.push(e);
        return e;
    }
    visitParamterType(e: ParameterExpression) {
        e.type = this.visit(e.type);
        return e;
    }
    visitArrayType(e: ArrayTypeExpression) {
        e.type = this.visit(e.type);

        return e;
    }
    visitUserType(e: UserTypeExpression) {
        if (!this.first) {
            let type = this.types.find(m => m.name === e.name);
            if (!type) {
                throw new SemanticError(e.position, 'could not find user type ' + e.name);
            }
            (e as any).resolvedAs = type;
        }
        return e;
    }

    visitVariable(e: VariableExpression): any {
        /*if (!this.first) {
            let type = this.scope[e.value];
            if (!type)
                throw new Error(`variable ${e.value}`);
            (e as any).resolvedAs = type;
        }*/
        return e;
    }

    visitImport(e: ImportExpression) {
        return e;
    }
}