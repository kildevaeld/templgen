

export enum TagType {
    Assignment = 1,
    Conditional,
    Loop,
    Code
}



export enum Token {
    Raw = 1, Loop, Conditional, Variable, Assignment, Arithmetic, Operation, Literal, FunctionCall,
    Tenary, Template, Block, Comment, Context, Property, Primitive, Accessor,
    Body, CustomType, Parameter, UserType, Array, Import
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

