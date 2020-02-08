import { TokenType as TT, Token } from "../../src/ifaces/ITokenizer";
import { ParseTreeBuilder } from "../../src/impl/ParseTreeBuilder";
import { ITokenizerMock } from "./ITokenizerMock";
import { expect } from "chai";

describe('ParseTreeBuilder', () => {
    it('should not throw for any TokenType except NotImplemented', () => {
        // Arrange
        const tokens = Object.keys(TT)
            .filter(key => typeof TT[key as any] === "number" && key !== "Unimplemented")
            .map(key => new Token(0, 0, TT[key], ""));

        const tokenizer = new ITokenizerMock(tokens);
        
        const parser = new ParseTreeBuilder(tokenizer);

        // Act
        const act = () => parser.tokensToParseTree();

        // Assert
        expect(act).to.not.throw();
    });
});