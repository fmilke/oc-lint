import { Token, TokenType } from "../ifaces/ITokenizer";

interface ValueTreeResult {
    value: string,
    children: ValueTreeResult[],
}

// interface IASTNode {
//     appendChild(node: ASTNode): void;

//     toTestObject(): any;
// }

export class ASTNode {
    children: ASTNode[] = [];

    constructor(protected token: Token) { }

    public appendChild(node: ASTNode) {
        this.children.push(node);
    }

    static fromTokenWithChild(parentToken: Token, childToken: Token) {
        const parent = new ASTNode(parentToken);
        parent.appendChild(new ASTNode(childToken));
        return parent;
    }

    static fromToken(token: Token) {
        return new ASTNode(token);
    }

    static createRoot() {
        return new ASTNode(new Token(0, 0, TokenType.Root, "root"));
    }

    toTestObject(): any {
        return {
            value: this.token.value,
            children: this.children.map(child => child.toTestObject()),
        };
    }
}

export class ASTMethodNode extends ASTNode {

    private parameters: ASTNode[] = [];
    private modifier: ASTNode | null = null;

    setParameters(nodes: ASTNode[]) {
        this.parameters = nodes;
    }

    setModifier(modifier: ASTNode | null) {
        this.modifier = modifier;
    }

    toTestObject() {
        return {
            parameters: this.parameters.map(child => child.toTestObject()),
            modifier: this.modifier !== null ? this.modifier.toTestObject() : null,
            value: this.token.value,
            children: this.children.map(child => child.toTestObject()),
        }
    }
}