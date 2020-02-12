import { Token, TokenType } from "../ifaces/ITokenizer";

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

export class ASTLeaf {
    constructor(protected token: Token) { }
    toTestObject(): any {
        return this.token.value;
    }
}

export class ASTParameterLeaf extends ASTLeaf {
    constructor(protected identToken: Token, private typeToken?: Token) {
        super(identToken);
    }

    toTestObject() {
        return {
            name: this.identToken.value,
            type: this.typeToken ? this.typeToken.value : null,
        }
    }
}

export class ASTMethodNode extends ASTNode {
    private parameters: ASTParameterLeaf[] = [];
    private modifier: ASTLeaf | null = null;
    constructor() {
        super(new Token(0, 0, TokenType.Identifier, ""));
    }

    setMethodName(token: Token) {
        this.token = token;
    }

    addParameter(identToken: Token) {
        this.parameters.push(new ASTParameterLeaf(identToken));
    }

    addParameterWithType(typeToken: Token, identToken: Token) {
        this.parameters.push(new ASTParameterLeaf(identToken, typeToken));
    }

    setModifier(modifierToken: Token | null) {
        this.modifier = modifierToken === null ? null : new ASTLeaf(modifierToken);
    }

    hasMethodName() {
        return this.token.value !== "";
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