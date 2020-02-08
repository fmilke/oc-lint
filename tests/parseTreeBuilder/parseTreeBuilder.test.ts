import { TokenType as TT, Token } from "../../src/ifaces/ITokenizer";
import { ParseTreeBuilder } from "../../src/impl/ParseTreeBuilder";
import { ITokenizerMock } from "./ITokenizerMock";
import { expect } from "chai";
import { Tokenizer } from "../../src/impl/Tokenizer";

describe('ParseTreeBuilder', () => {
    it('should not throw for any TokenType except NotImplemented', () => {
        // Arrange
        const tokens = Object.keys(TT)
            .filter(key => typeof TT[key as keyof typeof TT] === "number" && key !== "Unimplemented")
            .map((key: string) => new Token(0, 0, TT[key as keyof typeof TT], ""));

        const tokenizer = new ITokenizerMock(tokens);

        const parser = new ParseTreeBuilder(tokenizer);

        // Act
        const act = () => parser.tokensToParseTree();

        // Assert
        expect(act).to.not.throw();
    });
});