"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TagType;
(function (TagType) {
    TagType[TagType["Assignment"] = 1] = "Assignment";
    TagType[TagType["Conditional"] = 2] = "Conditional";
    TagType[TagType["Loop"] = 3] = "Loop";
    TagType[TagType["Code"] = 4] = "Code";
})(TagType = exports.TagType || (exports.TagType = {}));
var LiteralType;
(function (LiteralType) {
    LiteralType[LiteralType["Number"] = 0] = "Number";
    LiteralType[LiteralType["String"] = 1] = "String";
    LiteralType[LiteralType["Boolean"] = 2] = "Boolean";
})(LiteralType = exports.LiteralType || (exports.LiteralType = {}));
var Token;
(function (Token) {
    Token[Token["Raw"] = 1] = "Raw";
    Token[Token["Loop"] = 2] = "Loop";
    Token[Token["Conditional"] = 3] = "Conditional";
    Token[Token["Variable"] = 4] = "Variable";
    Token[Token["Assignment"] = 5] = "Assignment";
    Token[Token["Arithmetic"] = 6] = "Arithmetic";
    Token[Token["Operation"] = 7] = "Operation";
    Token[Token["Literal"] = 8] = "Literal";
    Token[Token["FunctionCall"] = 9] = "FunctionCall";
    Token[Token["Tenary"] = 10] = "Tenary";
    Token[Token["Template"] = 11] = "Template";
    Token[Token["Block"] = 12] = "Block";
    Token[Token["Comment"] = 13] = "Comment";
    Token[Token["Context"] = 14] = "Context";
    Token[Token["Property"] = 15] = "Property";
    Token[Token["Primitive"] = 16] = "Primitive";
    Token[Token["Accessor"] = 17] = "Accessor";
    Token[Token["Body"] = 18] = "Body";
    Token[Token["CustomType"] = 19] = "CustomType";
    Token[Token["Parameter"] = 20] = "Parameter";
    Token[Token["UserType"] = 21] = "UserType";
    Token[Token["Array"] = 22] = "Array";
})(Token = exports.Token || (exports.Token = {}));
var MathOperator;
(function (MathOperator) {
    MathOperator[MathOperator["Add"] = 1] = "Add";
    MathOperator[MathOperator["Div"] = 2] = "Div";
    MathOperator[MathOperator["Mul"] = 3] = "Mul";
    MathOperator[MathOperator["Pow"] = 4] = "Pow";
    MathOperator[MathOperator["Sub"] = 5] = "Sub";
    MathOperator[MathOperator["Mod"] = 6] = "Mod";
})(MathOperator = exports.MathOperator || (exports.MathOperator = {}));
var Operator;
(function (Operator) {
    Operator[Operator["Eq"] = 1] = "Eq";
    Operator[Operator["Lte"] = 2] = "Lte";
    Operator[Operator["Lt"] = 3] = "Lt";
    Operator[Operator["Gte"] = 4] = "Gte";
    Operator[Operator["Gt"] = 5] = "Gt";
    Operator[Operator["Neq"] = 6] = "Neq";
    Operator[Operator["Mod"] = 7] = "Mod";
})(Operator = exports.Operator || (exports.Operator = {}));
var Primitive;
(function (Primitive) {
    Primitive[Primitive["String"] = 1] = "String";
    Primitive[Primitive["Int"] = 2] = "Int";
    Primitive[Primitive["Float"] = 3] = "Float";
    Primitive[Primitive["Boolean"] = 4] = "Boolean";
    Primitive[Primitive["Date"] = 5] = "Date";
})(Primitive = exports.Primitive || (exports.Primitive = {}));
