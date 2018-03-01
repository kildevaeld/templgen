import { Token, Operator, MathOperator, Primitive } from './types';
import { ExpressionPosition } from './template_parser';
export declare abstract class Expression {
    position: ExpressionPosition;
    readonly abstract nodeType: Token;
    toJSON(full?: boolean, human?: boolean, location?: boolean): {};
    copy(): this;
    constructor(position: ExpressionPosition);
}
export declare class TenaryExpression extends Expression {
    conditional: Expression;
    left: Expression;
    right: Expression;
    nodeType: Token;
    constructor(location: ExpressionPosition, conditional: Expression, left: Expression, right: Expression);
}
export declare class FunctionCallExpression extends Expression {
    name: string;
    parameters: Expression[];
    nodeType: Token;
    constructor(location: ExpressionPosition, name: string, parameters: Expression[]);
}
export declare class OperationExpression extends Expression {
    right: Expression;
    operator: Operator;
    left: Expression;
    nodeType: Token;
    constructor(location: ExpressionPosition, right: Expression, operator: Operator, left: Expression);
}
export declare class ArithmeticExpression extends Expression {
    right: Expression;
    operator: MathOperator;
    left: Expression;
    nodeType: Token;
    constructor(location: ExpressionPosition, right: Expression, operator: MathOperator, left: Expression);
}
export declare class LiteralExpression extends Expression {
    type: Primitive;
    value: string;
    nodeType: Token;
    constructor(location: ExpressionPosition, type: Primitive, value: string);
}
export declare class RawExpression extends Expression {
    value: string;
    nodeType: Token;
    constructor(location: ExpressionPosition, value: string);
}
export declare class AssignmentExpression extends Expression {
    expression: Expression;
    modifier: string;
    nodeType: Token;
    constructor(location: ExpressionPosition, expression: Expression, modifier: string);
}
export declare class TemplateExpression extends Expression {
    name: string;
    parameters: ParameterExpression[];
    body: BodyExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, name: string, parameters: ParameterExpression[], body: BodyExpression);
}
export declare class LoopExpression extends Expression {
    key: VariableExpression | null;
    value: VariableExpression;
    iterator: Expression;
    body: BodyExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, key: VariableExpression | null, value: VariableExpression, iterator: Expression, body: BodyExpression);
}
export declare class ConditionalExpression extends Expression {
    expression: Expression;
    body: BodyExpression;
    elif: BlockExpression[];
    el: BodyExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, expression: Expression, body: BodyExpression, elif: BlockExpression[], el: BodyExpression);
}
export declare class BlockExpression extends Expression {
    expression: Expression;
    body: BodyExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, expression: Expression, body: BodyExpression);
}
export declare class CommentExpression extends Expression {
    comment: string;
    nodeType: Token;
    constructor(location: ExpressionPosition, comment: string);
}
export declare class PropertyExpression extends Expression {
    name: string;
    type: Expression;
    nodeType: Token;
    constructor(location: ExpressionPosition, name: string, type: Expression);
}
export declare class AccessorExpression extends Expression {
    names: string[];
    nodeType: Token;
    resolvedAs: Expression | undefined;
    constructor(location: ExpressionPosition, names: string[]);
}
export declare class BodyExpression extends Expression {
    value: Expression[];
    nodeType: Token;
    constructor(location: ExpressionPosition, value: Expression[]);
}
export declare class CustomTypeExpression extends Expression {
    name: string;
    properties: PropertyExpression[];
    nodeType: Token;
    constructor(location: ExpressionPosition, name: string, properties: PropertyExpression[]);
}
export declare class ParameterExpression extends Expression {
    name: string;
    type: TypeExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, name: string, type: TypeExpression);
}
export declare class ContextExpression extends Expression {
    value: BodyExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, value: BodyExpression);
}
export declare abstract class TypeExpression extends Expression {
}
export declare class PrimitiveExpression extends TypeExpression {
    type: Primitive;
    nodeType: Token;
    constructor(location: ExpressionPosition, type: Primitive);
}
export declare class UserTypeExpression extends TypeExpression {
    name: string;
    nodeType: Token;
    resolvedAs: CustomTypeExpression | undefined;
    constructor(location: ExpressionPosition, name: string);
}
export declare class ArrayTypeExpression extends TypeExpression {
    type: TypeExpression;
    nodeType: Token;
    constructor(location: ExpressionPosition, type: TypeExpression);
}
export declare class VariableExpression extends Expression {
    value: string;
    nodeType: Token;
    resolvedAs: PrimitiveExpression | CustomTypeExpression | ArrayTypeExpression | undefined;
    constructor(location: ExpressionPosition, value: string);
}
export declare function createExpression(type: Token, position: ExpressionPosition, ...args: any[]): Expression;
