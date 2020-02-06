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
    HashIdentifier,
    String,
    Number,

    // Punctuation
    Semicolon,
    Comma,
    Dot,

    // Operators
    ArithmicOperator,
    AssignmentOperator,
    BitwiseOperator,
    LogicalOperator,
    NilCaseOperator,

    // Parentheses
    Curly_Paren_L,
    Curly_Paren_R,
    Round_Paren_L,
    Round_Paren_R,
    Bracket_L,
    Bracket_R,
}