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
})(LiteralType = exports.LiteralType || (exports.LiteralType = {}));
var Token;
(function (Token) {
    Token[Token["Raw"] = 1] = "Raw";
    Token[Token["Tag"] = 2] = "Tag";
    Token[Token["Loop"] = 3] = "Loop";
    Token[Token["Conditional"] = 4] = "Conditional";
    Token[Token["Variable"] = 5] = "Variable";
    Token[Token["Assignment"] = 6] = "Assignment";
    Token[Token["Arithmetic"] = 7] = "Arithmetic";
    Token[Token["Operation"] = 8] = "Operation";
    Token[Token["Literal"] = 9] = "Literal";
    Token[Token["FunctionCall"] = 10] = "FunctionCall";
    Token[Token["Tenary"] = 11] = "Tenary";
    Token[Token["Template"] = 12] = "Template";
    Token[Token["Block"] = 13] = "Block";
    Token[Token["Comment"] = 14] = "Comment";
    Token[Token["Context"] = 15] = "Context";
    Token[Token["Property"] = 16] = "Property";
    Token[Token["Primitive"] = 17] = "Primitive";
    Token[Token["Accessor"] = 18] = "Accessor";
})(Token = exports.Token || (exports.Token = {}));
var MathOperator;
(function (MathOperator) {
    MathOperator[MathOperator["Add"] = 1] = "Add";
    MathOperator[MathOperator["Div"] = 2] = "Div";
    MathOperator[MathOperator["Mul"] = 3] = "Mul";
    MathOperator[MathOperator["Pow"] = 4] = "Pow";
    MathOperator[MathOperator["Sub"] = 5] = "Sub";
})(MathOperator = exports.MathOperator || (exports.MathOperator = {}));
var Operator;
(function (Operator) {
    Operator[Operator["Eq"] = 1] = "Eq";
    Operator[Operator["Lte"] = 2] = "Lte";
    Operator[Operator["Lt"] = 3] = "Lt";
    Operator[Operator["Gte"] = 4] = "Gte";
    Operator[Operator["Gt"] = 5] = "Gt";
    Operator[Operator["Neq"] = 6] = "Neq";
})(Operator = exports.Operator || (exports.Operator = {}));
var Primitive;
(function (Primitive) {
    Primitive[Primitive["String"] = 1] = "String";
    Primitive[Primitive["Int"] = 2] = "Int";
    Primitive[Primitive["Float"] = 3] = "Float";
})(Primitive = exports.Primitive || (exports.Primitive = {}));
