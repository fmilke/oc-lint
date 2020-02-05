import { expect } from "chai";
import { Tokenizer } from "../../src/impl/Tokenizer";
import { TokenType } from "../../src/ifaces/ITokenizer";


describe('Tokenizer', () => {
    it('should tokenize identifiers with values', () => {
        const testString = "Ident1 Ident2";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql(["Ident1", "Ident2", "EOF"]);
    });

    it('should tokenize identifiers with TokenType', () => {
        const testString = "Ident1 Ident2";
        const values = Tokenizer.getTokenTypes(testString);

        expect(values).to.eql([TokenType.Identifier, TokenType.Identifier, TokenType.EOF]);
    });

    it('should tokenize punctuation with values', () => {
        const testString = ", . ;";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql([",", ".", ";"]);
    });
});