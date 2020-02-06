import { expect } from "chai";
import { Tokenizer } from "../../src/impl/Tokenizer";
import { TokenType as TT } from "../../src/ifaces/ITokenizer";


describe('Tokenizer', () => {
    it('should tokenize identifiers with values', () => {
        const testString = "Ident1 Ident2";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql(["Ident1", "Ident2", "EOF"]);
    });

    it('should tokenize identifiers with TokenType', () => {
        const testString = "Ident1 Ident2";
        const values = Tokenizer.getTokenTypes(testString);

        expect(values).to.eql([TT.Identifier, TT.Identifier, TT.EOF]);
    });

    it('should tokenize punctuation with values', () => {
        const testString = ", . ;";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql([",", ".", ";", "EOF"]);
    });

    it('should tokenize punctuation with TokenTypes', () => {
        const testString = ", . ;";
        const values = Tokenizer.getTokenTypes(testString);

        expect(values).to.eql([TT.Comma, TT.Dot, TT.Semicolon, TT.EOF]);
    });

    it('should skip line comments', () => {
        const testString = "id1 // Comment\n id2";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql(["id1", "id2", "EOF"]);
    });

    it('should skip block comments', () => {
        const testString = "id1 /* Comment */ id2";
        const values = Tokenizer.getValues(testString);

        expect(values).to.eql(["id1", "id2", "EOF"]);
    });

    it('should tokenize arithmetic operators with TokenTypes', () => {
        // Arange
        const arithmeticOperators = [
            "-",
            "+",
            "%",
            "*",
            "/",
            "**",
        ];
        const checkTts = arithmeticOperators.map(_ => TT.ArithmicOperator);
        checkTts.push(TT.EOF);
        const testString = arithmeticOperators.join(" ");

        // Act
        const tts = Tokenizer.getTokenTypes(testString);

        // Assert
        expect(tts).to.eql(checkTts);
    });

    it('should tokenize string with TokenTypes', () => {
        const testString = 'id1"SomeString"  id2';
        const values = Tokenizer.getTokenTypes(testString);

        expect(values).to.eql([TT.Identifier, TT.String, TT.Identifier, TT.EOF]);
    });

    it('should tokenize assignment operators with TokenTypes', () => {
        // Arange
        const assignmentOperators = [
            "-=",
            "+=",
            "%=",
            "*=",
            "/=",
            "=",
        ];
        const checkTts = assignmentOperators.map(_ => TT.AssignmentOperator);
        checkTts.push(TT.EOF);
        const testString = assignmentOperators.join(" ");

        // Act
        const tts = Tokenizer.getTokenTypes(testString);

        // Assert
        expect(tts).to.eql(checkTts);
    });

    it('should tokenize all operators', () => {
        const operators = [
            "++",
            "--",
            "~",
            "!",
            "+",
            "-",
            "++",
            "--",
            "**",
            "/",
            "*",
            "%",
            "-",
            "+",
            "<<",
            ">>",
            "<",
            "<=",
            ">",
            ">=",
            "==",
            "!=",
            "&",
            "^",
            "|",
            "&&",
            "||",
            "??",
            "*=",
            "/=",
            "%=",
            "+=",
            "-=",
            "=",
        ];

        expect(() => Tokenizer.tokenize(operators.join(" "))).to.not.throw();
    });
});