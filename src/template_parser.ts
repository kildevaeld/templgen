

export interface Position {
    offsert: number;
    line: number;
    column: number;
}

export interface ExpressionPosition {
    start: Position;
    end: Position
}

import { ContextExpression } from './expressions';

export declare function parse(input: string): ContextExpression;

export interface SyntaxError extends Error {
    message: string;
    expected: string;
    found: string;
    location: ExpressionPosition;
}
