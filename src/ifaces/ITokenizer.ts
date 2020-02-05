export interface ITokenizer {
    nextToken(): Token;
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
}