import { expect } from "chai";
import { PrecedenceParser } from "../../src/impl/PrecedenceParser";
import { Token, TokenType } from "../../src/ifaces/ITokenizer";
import { UnparsedOperatorNode, IdentifierNode } from "../../src/model/ASTNode";

describe('Precedence Parser', () => {
    it(`should parse addition by precedence`, () => {
        const nodes: any = [
            new IdentifierNode(new Token(0, 0, TokenType.ArithmicOperator, "a")),
            new UnparsedOperatorNode(new Token(0, 0, TokenType.ArithmicOperator, "*")),
            new IdentifierNode(new Token(0, 0, TokenType.ArithmicOperator, "b")),
        ];

        const parser = new PrecedenceParser(nodes);
        const result = parser.parse() || new IdentifierNode(new Token(0, 0, TokenType.Identifier, "failed"));

        expect(result.toTestObject()).to.eql({
            operator: "*",
            left: "a",
            right: "b",
        });
    });
});