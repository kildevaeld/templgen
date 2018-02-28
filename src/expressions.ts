import { Token, TagType, LiteralType, Operator, MathOperator, Primitive } from './types';
import { ExpressionPosition } from './template_parser';


export abstract class Expression {
    abstract readonly nodeType: Token

    toJSON(full: boolean = false, human: boolean = false, location: boolean = false) {
        if (full === true) return this;
        return Object.keys(this)
            .filter((key) => ['position'].indexOf(key) < 0)
            .reduce((newObj, key) => {
                var val = (this as any)[key];
                if (key === "nodeType" && human) {
                    val = Token[val];
                } else if (key === "tagType" && human) {
                    val = TagType[val];
                }

                if (val instanceof Expression) {
                    val = val.toJSON(full, human, location);
                    //return Object.assign(newObj, {[key]: this[key].toJSON(full, human)});
                } else if (Array.isArray(val)) {
                    val = val.map(m => {
                        if (m instanceof Expression) return m.toJSON(full, human, location);
                        return m;
                    })
                }

                return Object.assign(newObj, { [key]: val })
            }, {})
    }

    constructor(public position: ExpressionPosition) { }
}


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

export class TenaryExpression extends Expression {
    nodeType = Token.Tenary;
    constructor(location: ExpressionPosition, public conditional: Expression, public left: Expression, public right: Expression) {
        super(location)
    }
}

export class FunctionCallExpression extends Expression {
    nodeType = Token.FunctionCall;
    constructor(location: ExpressionPosition, public name: string, public parameters: Expression[]) {
        super(location)
    }
}

export class OperationExpression extends Expression {
    nodeType = Token.Operation;
    constructor(location: ExpressionPosition, public right: Expression, public operator: Operator, public left: Expression) {
        super(location)
    }
}

export class ArithmeticExpression extends Expression {
    nodeType = Token.Arithmetic;
    constructor(location: ExpressionPosition, public right: Expression, public operator: MathOperator, public left: Expression) {
        super(location)
    }
}

export class LiteralExpression extends Expression {
    nodeType = Token.Literal;
    constructor(location: ExpressionPosition, public literalType: LiteralType, public value: string) {
        super(location)
    }
}

export class RawExpression extends Expression {
    nodeType = Token.Raw;
    constructor(location: ExpressionPosition, public value: string) {
        super(location)
    }
}


export class AssignmentExpression extends Expression {
    nodeType = Token.Assignment;
    // tagType = TagType.Assignment
    constructor(location: ExpressionPosition, public expression: Expression, public modifier: string) {
        super(location)
    }
}

/*export class TagExpression extends Expression {
    nodeType = Token.Tag;
    constructor(location: ExpressionPosition, public expression: Expression) {
        super(location)
    }
}*/

export class TemplateExpression extends Expression {
    nodeType = Token.Template;
    constructor(location: ExpressionPosition, public name: string, public parameters: ParameterExpression[], public body: BodyExpression) {
        super(location);
    }
}

export class LoopExpression extends Expression {
    nodeType = Token.Loop;
    constructor(location: ExpressionPosition, public key: VariableExpression | null, public value: VariableExpression, public iterator: Expression, public body: BodyExpression) {
        super(location);
    }
}

export class ConditionalExpression extends Expression {
    nodeType = Token.Conditional;
    constructor(location: ExpressionPosition, public expression: Expression, public body: BodyExpression, public elif: BlockExpression[], public el: BodyExpression) {
        super(location);
    }
}

export class BlockExpression extends Expression {
    nodeType = Token.Block;
    constructor(location: ExpressionPosition, public expression: Expression, public body: BodyExpression) {
        super(location);
    }
}

export class CommentExpression extends Expression {
    nodeType = Token.Comment;
    constructor(location: ExpressionPosition, public comment: string) {
        super(location);
    }
}
/*
export class ContextExpression extends Expression {
    nodeType = Token.Context;
    constructor(location: ExpressionPosition, public properties: PropertyExpression[]) {
        super(location);
    }
}*/

export class PropertyExpression extends Expression {
    nodeType = Token.Property;
    constructor(location: ExpressionPosition, public name: string, public type: Expression) {
        super(location);
    }
}




export class AccessorExpression extends Expression {
    nodeType = Token.Accessor;
    resolvedAs: Expression | undefined;
    constructor(location: ExpressionPosition, public names: string[]) {
        super(location);
    }
}

export class BodyExpression extends Expression {
    nodeType = Token.Body;
    constructor(location: ExpressionPosition, public value: Expression[]) {
        super(location);
    }
}

/*export class MixinExpression extends Expression {
    nodeType = Token.Mixin;
    constructor(location: ExpressionPosition, public name: VariableExpression, public params: string[], public body: BodyExpression) {
        super(location);
    }
}*/


export class CustomTypeExpression extends Expression {
    nodeType = Token.CustomType;
    constructor(location: ExpressionPosition, public name: string, public properties: PropertyExpression[]) {
        super(location);
    }
}

export class ParameterExpression extends Expression {
    nodeType = Token.Parameter;
    constructor(location: ExpressionPosition, public name: string, public type: TypeExpression) {
        super(location);
    }
}

export class ContextExpression extends Expression {
    nodeType = Token.Context;
    constructor(location: ExpressionPosition, public value: BodyExpression) {
        super(location);
    }
}

export abstract class TypeExpression extends Expression {

}

export class PrimitiveExpression extends TypeExpression {
    nodeType = Token.Primitive;
    constructor(location: ExpressionPosition, public type: Primitive) {
        super(location);
    }
}

export class UserTypeExpression extends TypeExpression {
    nodeType = Token.UserType;
    resolvedAs: CustomTypeExpression | undefined;
    constructor(location: ExpressionPosition, public name: string) {
        super(location);
    }
}

export class ArrayTypeExpression extends TypeExpression {
    nodeType = Token.Array;
    constructor(location: ExpressionPosition, public type: TypeExpression) {
        super(location);
    }
}

export class VariableExpression extends Expression {
    nodeType = Token.Variable;
    resolvedAs: PrimitiveExpression | CustomTypeExpression | ArrayTypeExpression | undefined;
    constructor(location: ExpressionPosition, public value: string) {
        super(location);
    }
}

export function createExpression(type: Token, position: ExpressionPosition, ...args: any[]): Expression {
    switch (type) {
        case Token.Assignment: return new AssignmentExpression(position, args[0], args[1]);
        case Token.Variable: return new VariableExpression(position, args[0]);
        case Token.FunctionCall: return new FunctionCallExpression(position, args[0], args[1]);
        case Token.Operation: return new OperationExpression(position, args[0], args[1], args[2]);
        case Token.Arithmetic: return new ArithmeticExpression(position, args[0], args[1], args[2]);
        case Token.Literal: return new LiteralExpression(position, args[0], args[1]);
        case Token.Raw: return new RawExpression(position, args[0]);
        case Token.Tenary: return new TenaryExpression(position, args[0], args[1], args[2]);
        case Token.Loop: return new LoopExpression(position, args[0], args[1], args[2], args[3]);
        case Token.Template: return new TemplateExpression(position, args[0], args[1], args[2]);
        case Token.Block: return new BlockExpression(position, args[1], args[2]);
        case Token.Conditional: return new ConditionalExpression(position, args[0], args[1], args[2], args[3]);
        case Token.Comment: return new CommentExpression(position, args[0]);
        case Token.Context: return new ContextExpression(position, args[0]);
        case Token.Property: return new PropertyExpression(position, args[0], args[1]);
        case Token.Primitive: return new PrimitiveExpression(position, args[0]);
        case Token.Accessor: return new AccessorExpression(position, args[0]);
        case Token.Body: return new BodyExpression(position, args[0]);
        //case Token.Mixin: return new MixinExpression(position, args[0], args[1], args[2]);
        case Token.CustomType: return new CustomTypeExpression(position, args[0], args[1]);
        case Token.Parameter: return new ParameterExpression(position, args[0], args[1]);
        case Token.UserType: return new UserTypeExpression(position, args[0]);
        case Token.Array: return new ArrayTypeExpression(position, args[0]);

        /*case Token.Tag: {
            switch (args[0]) {
                case TagType.Assignment:
                    return new TagAssignmentExpression(position, args[1], args[2]);
                default:
                    return new TagExpression(position, args[1]);
            }
        }*/
    }
    console.log(args)
    throw new TypeError("invalid token " + type);
}