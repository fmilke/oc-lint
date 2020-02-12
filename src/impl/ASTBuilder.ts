import { Token, TokenType } from "../ifaces/ITokenizer";
import { ASTNode } from "../model/ASTNode";

export class ASTBuilder {
    private root = ASTNode.createRoot();
    private current = this.root;

    constructor() { }

    addHashIdentifierNode(hashIdentToken: Token, identToken: Token) {
        this.current.appendChild(
            ASTNode.fromTokenWithChild(hashIdentToken, identToken
        ));
    }

    getAST() {
        return this.current;
    }
}