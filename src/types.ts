

export enum TagType {
    Assignment = 1,
    Conditional,
    Loop,
    Code
}

export enum LiteralType {
    Number, String, Boolean
}

export enum Token {
    Raw = 1, /*Tag,*/ Loop, Conditional, Variable, Assignment, Arithmetic, Operation, Literal, FunctionCall,
    Tenary, Template, Block, Comment, Context, Property, Primitive, Accessor,
    Body, /*Mixin,*/ CustomType, Parameter, UserType, Array
}

export enum MathOperator {
    Add = 1, Div, Mul, Pow, Sub, Mod
}

export enum Operator {
    Eq = 1, Lte, Lt, Gte, Gt, Neq, Mod
}

export enum Primitive {
    String = 1, Int, Float, Boolean, Date
}

