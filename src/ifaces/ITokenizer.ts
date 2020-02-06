export interface ITokenizer {
    nextToken(): Token;
    // [Symbol.iterator](): Token;
    // [Symbol.iterator](): Generator<Token, void, void>;
}

export class Token {
    constructor(
        public readonly start: number,
        public readonly end: number,
        public readonly type: TokenType,
        public readonly value: string,
    ) {}
}

export enum TokenType {
    Unimplemented,
    EOF,
    
    Identifier,
    String,

    // Punctuation
    Semicolon,
    Comma,
    Dot,

    // Operators
    ArithmicOperator,
    AssignmentOperator,
    BitwiseOperator,
}