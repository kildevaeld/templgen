export interface Position {
    offsert: number;
    line: number;
    column: number;
}
export interface ExpressionPosition {
    start: Position;
    end: Position;
}
export declare function parse(input: string): any;
export interface SyntaxError extends Error {
    message: string;
    expected: string;
    found: string;
    location: ExpressionPosition;
}
