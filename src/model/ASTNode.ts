import { Token, TokenType } from "../ifaces/ITokenizer";

interface ValueTreeResult {
    value: string,
    children: ValueTreeResult[],
}

export class ASTNode {
    children: ASTNode[] = [];

    constructor(private token: Token) {

    }

    appendChild(node: ASTNode) {
        this.children.push(node);
    }

    static fromTokenWithChild(parentToken: Token, childToken: Token) {
        const parent = new ASTNode(parentToken);
        parent.appendChild(new ASTNode(childToken));
        return parent;
    }

    static createRoot() {
        return new ASTNode(new Token(0, 0, TokenType.Root, "root"));
    }

    static getValueTree(node: ASTNode): ValueTreeResult {
        return {
            value: node.token.value,
            children: node.children.map(ASTNode.getValueTree)
        }
    }
}