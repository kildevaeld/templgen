"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const visitor_1 = require("../visitor");
const expressions_1 = require("../expressions");
const types_1 = require("../types");
const utils_1 = require("../utils");
class SemanticError extends Error {
    constructor(location, message) {
        super(message);
        this.location = location;
        this.message = message;
        Object.setPrototypeOf(this, SemanticError.prototype);
    }
}
exports.SemanticError = SemanticError;
class UserValueVisitor extends visitor_1.AbstractExpressionVisitor {
    constructor() {
        super(...arguments);
        this.resolves = [];
        this.types = [];
        this.templates = [];
        this.scope = {};
        this.first = true;
        this.name = "Types";
    }
    parse(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e = this.visit(e);
            this.first = false;
            let types = utils_1.flatten(e.imports.map(m => m.value.value.filter(m => m.nodeType === types_1.Token.CustomType)));
            this.types = this.types.concat(types);
            let templates = utils_1.flatten(e.imports.map(m => m.value.value.filter(m => m.nodeType === types_1.Token.Template)));
            this.templates = this.templates.concat(templates);
            e = this.visit(e);
            return e;
        });
    }
    visit(e) {
        if (!e)
            return e;
        return super.visit(e);
    }
    visitTemplateExpression(e) {
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
    visitAssignmentExpression(e) {
        e.expression = this.visit(e.expression);
        /*if (!this.first) {
            if (e.expression.nodeType === Token.UserType) {
                e.
            }
        }*/
        return e;
    }
    visitRawExpression(e) {
        return e;
    }
    visitLoopExpression(e) {
        e.key = this.visit(e.key);
        e.value = this.visit(e.value);
        e.iterator = this.visit(e.iterator);
        if (!this.first) {
            let type = e.iterator.resolvedAs;
            if (type.nodeType != types_1.Token.Array) {
                throw new Error('iterator is not a array');
            }
            if (e.key) {
                e.key.resolvedAs = new expressions_1.PrimitiveExpression(e.position, types_1.Primitive.Int);
                this.scope[e.key.value] = e.key.resolvedAs;
            }
            e.value.resolvedAs = type.type;
            this.scope[e.value.value] = e.value.resolvedAs;
        }
        e.body = this.visit(e.body);
        if (e.key)
            this.scope[e.key.value] = e.key.resolvedAs;
        this.scope[e.value.value] = e.value.resolvedAs;
        return e;
    }
    visitConditionalExpression(e) {
        e.body = this.visit(e.body);
        e.el = e.el ? this.visit(e.el) : e.el;
        e.elif = e.elif.map(m => this.visit(m));
        e.expression = this.visit(e.expression);
        return e;
    }
    visitArithmeticExpression(e) {
        e.left = this.visit(e.left);
        e.right = this.visit(e.right);
        return e;
    }
    visitBinaryOperationExpression(e) {
        return e;
    }
    visitLiteralExpression(e) {
        return e;
    }
    visitFunctionCallExpression(e) {
        e.parameters = e.parameters.map(m => this.visit(m));
        if (!this.first) {
            let templ = this.templates.find(m => m.name == e.name);
            if (!templ) {
                throw new SemanticError(e.position, 'invalid functioncal ' + e.name);
            }
            if (e.parameters.length !== templ.parameters.length) {
                throw new SemanticError(e.position, "invalid parameter count " + e.name);
            }
            for (let i = 0, ii = e.parameters.length; i < ii; i++) {
                let p1 = e.parameters[i], p2 = templ.parameters[i].type;
                let pt1 = p1.resolvedAs || p1, pt2 = p2.resolvedAs || p2;
                if (pt1.nodeType !== pt2.nodeType) {
                    throw new SemanticError(e.position, `invalid parameter at #${i}`);
                }
                switch (pt1.nodeType) {
                    case types_1.Token.Primitive:
                        {
                            if (pt1.type !== pt2.type) {
                                throw new SemanticError(e.position, `invalid parameter at #${i}`);
                            }
                        }
                        break;
                    case types_1.Token.CustomType:
                        {
                            if (pt1.name !== pt2.name) {
                                throw new SemanticError(e.position, `invalid paramter at #${i}`);
                            }
                        }
                        break;
                }
            }
        }
        return e;
    }
    visitTenaryExpression(e) {
        e.right = this.visit(e.right);
        e.left = this.visit(e.left);
        e.conditional = this.visit(e.conditional);
        return e;
    }
    visitBlockExpression(e) {
        e.body = this.visit(e.body);
        e.expression = e.expression ? this.visit(e.expression) : e.expression;
        return e;
    }
    visitCommentExpression(e) {
        return e;
    }
    visitContextExpression(e) {
        e.value = this.visit(e.value);
        return e;
    }
    visitPropertyExpression(e) {
        e.type = this.visit(e.type);
        return e;
    }
    visitPrimitiveExpression(e) {
        return e;
    }
    visitAccessor(e) {
        this.resolves.push(e);
        if (!this.first) {
            let len = e.names.length;
            let type;
            if (this.scope[e.names[0]]) {
                type = this.scope[e.names[0]];
            }
            else {
                throw new SemanticError(e.position, 'invalid accessor ' + e.names[0]);
            }
            if (type.nodeType !== types_1.Token.UserType && len > 1) {
                throw new SemanticError(e.position, `cannot get ${e.names[1]} of ${e.names[2]}`);
            }
            else if (type.nodeType == types_1.Token.UserType && len > 1) {
                let i = 0;
                let ct = type.resolvedAs;
                while (++i < len) {
                    type = ct.properties.find(m => m.name == e.names[i]);
                    if (!type) {
                        throw new SemanticError(e.position, 'invalid type ' + e.names.slice(0, i + 1).join('.'));
                    }
                    if (type.nodeType == types_1.Token.CustomType)
                        ct = type;
                }
            }
            if (type instanceof expressions_1.UserTypeExpression)
                type = type.resolvedAs;
            e.resolvedAs = type instanceof expressions_1.PropertyExpression ? type.type : type;
            //if (type!.nodeType !== Token.)
        }
        return e;
    }
    visitBody(e) {
        e.value = e.value.map(m => this.visit(m));
        return e;
    }
    visitCustomType(e) {
        e.properties = e.properties.map(m => this.visit(m));
        if (this.first)
            this.types.push(e);
        return e;
    }
    visitParamterType(e) {
        e.type = this.visit(e.type);
        return e;
    }
    visitArrayType(e) {
        e.type = this.visit(e.type);
        return e;
    }
    visitUserType(e) {
        if (!this.first) {
            let type = this.types.find(m => m.name === e.name);
            if (!type) {
                throw new SemanticError(e.position, 'could not find user type ' + e.name);
            }
            e.resolvedAs = type;
        }
        return e;
    }
    visitVariable(e) {
        /*if (!this.first) {
            let type = this.scope[e.value];
            if (!type)
                throw new Error(`variable ${e.value}`);
            (e as any).resolvedAs = type;
        }*/
        return e;
    }
    visitImport(e) {
        return e;
    }
}
exports.UserValueVisitor = UserValueVisitor;
