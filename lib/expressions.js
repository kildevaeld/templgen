"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class Expression {
    constructor(position) {
        this.position = position;
    }
    toJSON(full = false, human = false, location = false) {
        if (full === true)
            return this;
        return Object.keys(this)
            .filter((key) => ['position'].indexOf(key) < 0)
            .reduce((newObj, key) => {
            var val = this[key];
            if (key === "nodeType" && human) {
                val = types_1.Token[val];
            }
            else if (key === "tagType" && human) {
                val = types_1.TagType[val];
            }
            if (val instanceof Expression) {
                val = val.toJSON(full, human, location);
                //return Object.assign(newObj, {[key]: this[key].toJSON(full, human)});
            }
            else if (Array.isArray(val)) {
                val = val.map(m => {
                    if (m instanceof Expression)
                        return m.toJSON(full, human, location);
                    return m;
                });
            }
            return Object.assign(newObj, { [key]: val });
        }, {});
    }
    copy() {
        let e = new this.constructor();
        for (let k in this) {
            if (!Object.prototype.hasOwnProperty.call(this, k))
                continue;
            if (this[k] instanceof Expression) {
                e[k] = this[k].copy();
            }
            else {
                e[k] = this[k];
            }
        }
        return e;
    }
}
exports.Expression = Expression;
/*export class AssignmentExpression extends Expression {
    nodeType = Token.Assignment;
    constructor(location: ExpressionPosition, public name: string, public expression: Expression, public declaring: boolean) {
        super(location)
    }
}*/
/*export class VariableExpression extends Expression {
    nodeType = Token.Variable;
    constructor(location: ExpressionPosition, public name: string) {
        super(location)
    }
}*/
class TenaryExpression extends Expression {
    constructor(location, conditional, left, right) {
        super(location);
        this.conditional = conditional;
        this.left = left;
        this.right = right;
        this.nodeType = types_1.Token.Tenary;
    }
}
exports.TenaryExpression = TenaryExpression;
class FunctionCallExpression extends Expression {
    constructor(location, name, parameters) {
        super(location);
        this.name = name;
        this.parameters = parameters;
        this.nodeType = types_1.Token.FunctionCall;
    }
}
exports.FunctionCallExpression = FunctionCallExpression;
class OperationExpression extends Expression {
    constructor(location, right, operator, left) {
        super(location);
        this.right = right;
        this.operator = operator;
        this.left = left;
        this.nodeType = types_1.Token.Operation;
    }
}
exports.OperationExpression = OperationExpression;
class ArithmeticExpression extends Expression {
    constructor(location, right, operator, left) {
        super(location);
        this.right = right;
        this.operator = operator;
        this.left = left;
        this.nodeType = types_1.Token.Arithmetic;
    }
}
exports.ArithmeticExpression = ArithmeticExpression;
class LiteralExpression extends Expression {
    constructor(location, literalType, value) {
        super(location);
        this.literalType = literalType;
        this.value = value;
        this.nodeType = types_1.Token.Literal;
    }
}
exports.LiteralExpression = LiteralExpression;
class RawExpression extends Expression {
    constructor(location, value) {
        super(location);
        this.value = value;
        this.nodeType = types_1.Token.Raw;
    }
}
exports.RawExpression = RawExpression;
class AssignmentExpression extends Expression {
    // tagType = TagType.Assignment
    constructor(location, expression, modifier) {
        super(location);
        this.expression = expression;
        this.modifier = modifier;
        this.nodeType = types_1.Token.Assignment;
    }
}
exports.AssignmentExpression = AssignmentExpression;
/*export class TagExpression extends Expression {
    nodeType = Token.Tag;
    constructor(location: ExpressionPosition, public expression: Expression) {
        super(location)
    }
}*/
class TemplateExpression extends Expression {
    constructor(location, name, parameters, body) {
        super(location);
        this.name = name;
        this.parameters = parameters;
        this.body = body;
        this.nodeType = types_1.Token.Template;
    }
}
exports.TemplateExpression = TemplateExpression;
class LoopExpression extends Expression {
    constructor(location, key, value, iterator, body) {
        super(location);
        this.key = key;
        this.value = value;
        this.iterator = iterator;
        this.body = body;
        this.nodeType = types_1.Token.Loop;
    }
}
exports.LoopExpression = LoopExpression;
class ConditionalExpression extends Expression {
    constructor(location, expression, body, elif, el) {
        super(location);
        this.expression = expression;
        this.body = body;
        this.elif = elif;
        this.el = el;
        this.nodeType = types_1.Token.Conditional;
    }
}
exports.ConditionalExpression = ConditionalExpression;
class BlockExpression extends Expression {
    constructor(location, expression, body) {
        super(location);
        this.expression = expression;
        this.body = body;
        this.nodeType = types_1.Token.Block;
    }
}
exports.BlockExpression = BlockExpression;
class CommentExpression extends Expression {
    constructor(location, comment) {
        super(location);
        this.comment = comment;
        this.nodeType = types_1.Token.Comment;
    }
}
exports.CommentExpression = CommentExpression;
/*
export class ContextExpression extends Expression {
    nodeType = Token.Context;
    constructor(location: ExpressionPosition, public properties: PropertyExpression[]) {
        super(location);
    }
}*/
class PropertyExpression extends Expression {
    constructor(location, name, type) {
        super(location);
        this.name = name;
        this.type = type;
        this.nodeType = types_1.Token.Property;
    }
}
exports.PropertyExpression = PropertyExpression;
class AccessorExpression extends Expression {
    constructor(location, names) {
        super(location);
        this.names = names;
        this.nodeType = types_1.Token.Accessor;
    }
}
exports.AccessorExpression = AccessorExpression;
class BodyExpression extends Expression {
    constructor(location, value) {
        super(location);
        this.value = value;
        this.nodeType = types_1.Token.Body;
    }
}
exports.BodyExpression = BodyExpression;
/*export class MixinExpression extends Expression {
    nodeType = Token.Mixin;
    constructor(location: ExpressionPosition, public name: VariableExpression, public params: string[], public body: BodyExpression) {
        super(location);
    }
}*/
class CustomTypeExpression extends Expression {
    constructor(location, name, properties) {
        super(location);
        this.name = name;
        this.properties = properties;
        this.nodeType = types_1.Token.CustomType;
    }
}
exports.CustomTypeExpression = CustomTypeExpression;
class ParameterExpression extends Expression {
    constructor(location, name, type) {
        super(location);
        this.name = name;
        this.type = type;
        this.nodeType = types_1.Token.Parameter;
    }
}
exports.ParameterExpression = ParameterExpression;
class ContextExpression extends Expression {
    constructor(location, value) {
        super(location);
        this.value = value;
        this.nodeType = types_1.Token.Context;
    }
}
exports.ContextExpression = ContextExpression;
class TypeExpression extends Expression {
}
exports.TypeExpression = TypeExpression;
class PrimitiveExpression extends TypeExpression {
    constructor(location, type) {
        super(location);
        this.type = type;
        this.nodeType = types_1.Token.Primitive;
    }
}
exports.PrimitiveExpression = PrimitiveExpression;
class UserTypeExpression extends TypeExpression {
    constructor(location, name) {
        super(location);
        this.name = name;
        this.nodeType = types_1.Token.UserType;
    }
}
exports.UserTypeExpression = UserTypeExpression;
class ArrayTypeExpression extends TypeExpression {
    constructor(location, type) {
        super(location);
        this.type = type;
        this.nodeType = types_1.Token.Array;
    }
}
exports.ArrayTypeExpression = ArrayTypeExpression;
class VariableExpression extends Expression {
    constructor(location, value) {
        super(location);
        this.value = value;
        this.nodeType = types_1.Token.Variable;
    }
}
exports.VariableExpression = VariableExpression;
function createExpression(type, position, ...args) {
    switch (type) {
        case types_1.Token.Assignment: return new AssignmentExpression(position, args[0], args[1]);
        case types_1.Token.Variable: return new VariableExpression(position, args[0]);
        case types_1.Token.FunctionCall: return new FunctionCallExpression(position, args[0], args[1]);
        case types_1.Token.Operation: return new OperationExpression(position, args[0], args[1], args[2]);
        case types_1.Token.Arithmetic: return new ArithmeticExpression(position, args[0], args[1], args[2]);
        case types_1.Token.Literal: return new LiteralExpression(position, args[0], args[1]);
        case types_1.Token.Raw: return new RawExpression(position, args[0]);
        case types_1.Token.Tenary: return new TenaryExpression(position, args[0], args[1], args[2]);
        case types_1.Token.Loop: return new LoopExpression(position, args[0], args[1], args[2], args[3]);
        case types_1.Token.Template: return new TemplateExpression(position, args[0], args[1], args[2]);
        case types_1.Token.Block: return new BlockExpression(position, args[1], args[2]);
        case types_1.Token.Conditional: return new ConditionalExpression(position, args[0], args[1], args[2], args[3]);
        case types_1.Token.Comment: return new CommentExpression(position, args[0]);
        case types_1.Token.Context: return new ContextExpression(position, args[0]);
        case types_1.Token.Property: return new PropertyExpression(position, args[0], args[1]);
        case types_1.Token.Primitive: return new PrimitiveExpression(position, args[0]);
        case types_1.Token.Accessor: return new AccessorExpression(position, args[0]);
        case types_1.Token.Body: return new BodyExpression(position, args[0]);
        //case Token.Mixin: return new MixinExpression(position, args[0], args[1], args[2]);
        case types_1.Token.CustomType: return new CustomTypeExpression(position, args[0], args[1]);
        case types_1.Token.Parameter: return new ParameterExpression(position, args[0], args[1]);
        case types_1.Token.UserType: return new UserTypeExpression(position, args[0]);
        case types_1.Token.Array: return new ArrayTypeExpression(position, args[0]);
    }
    console.log(args);
    throw new TypeError("invalid token " + type);
}
exports.createExpression = createExpression;
