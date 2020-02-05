import { expect } from "chai";
import { Tokenizer } from "../../src/impl/Tokenizer";


describe('Tokenizer', () => {
    it('should tokenize identifiers', () => {
        const testString = "Ident1 Ident2";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql(["Ident1", "Ident2"]);
    });
});