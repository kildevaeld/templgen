export declare enum TagType {
    Assignment = 1,
    Conditional = 2,
    Loop = 3,
    Code = 4,
}
export declare enum LiteralType {
    Number = 0,
    String = 1,
    Boolean = 2,
}
export declare enum Token {
    Raw = 1,
    Loop = 2,
    Conditional = 3,
    Variable = 4,
    Assignment = 5,
    Arithmetic = 6,
    Operation = 7,
    Literal = 8,
    FunctionCall = 9,
    Tenary = 10,
    Template = 11,
    Block = 12,
    Comment = 13,
    Context = 14,
    Property = 15,
    Primitive = 16,
    Accessor = 17,
    Body = 18,
    CustomType = 19,
    Parameter = 20,
    UserType = 21,
    Array = 22,
}
export declare enum MathOperator {
    Add = 1,
    Div = 2,
    Mul = 3,
    Pow = 4,
    Sub = 5,
    Mod = 6,
}
export declare enum Operator {
    Eq = 1,
    Lte = 2,
    Lt = 3,
    Gte = 4,
    Gt = 5,
    Neq = 6,
    Mod = 7,
}
export declare enum Primitive {
    String = 1,
    Int = 2,
    Float = 3,
    Boolean = 4,
    Date = 5,
}
