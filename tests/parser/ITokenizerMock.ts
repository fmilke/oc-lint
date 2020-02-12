import { ITokenizer, Token } from "../../src/ifaces/ITokenizer";


export class ITokenizerMock implements ITokenizer {
    constructor(private tokens: Token[]) {}
    
    nextToken(): Token {
        throw new Error("Method not implemented.");
    }
    
    *[Symbol.iterator](): Iterator<Token, void> {
        for (let token of this.tokens)
            yield token;
    }
}