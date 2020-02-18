import { Token, TokenType } from "../ifaces/ITokenizer";

export class ASTNode {
    children: ASTNode[] = [];

    protected _parent: ASTNode | null = null;

    get parent() {
        return this._parent;
    }

    constructor(public token: Token) { }

    public appendChild(node: ASTNode) {
        this.children.push(node);

        if (node._parent !== null) {
            node._parent.removeChild(node);
        }

        node._parent = this;
    }

    public removeChild(node: ASTNode) {
        const idx = this.children.indexOf(node);
        if (idx === -1)
            throw new Error("Trying to remove node which is not a child");   
        
        this.children.splice(idx, 1);
        node._parent = null;
    }

    public replaceChild(oldChild: ASTNode, newChild: ASTNode) {
        const idx = this.children.indexOf(oldChild);

        if (idx === -1)
            throw new Error("Trying to replace node which is not a child");

        this.children[idx] = newChild;
        oldChild._parent = null;
        newChild.removeSafelyFromParent();
        newChild._parent = this;
    }

    public removeSafelyFromParent() {
        if (this._parent !== null)
            this._parent.removeChild(this);
    }

    public getRoot(): ASTNode | null {
        return this._parent !== null ? this._parent.getRoot() : this;
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

    toDebugString(level: number = 0) {
        let str = `${'-'.padStart(level * 2, " ")}${this.token.value}\n`;
        for (let child of this.children) {
            str += child.toDebugString(level + 1);
        }

        return str;
    }
}

export class ASTLeaf {
    constructor(public token: Token) { }
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
            value: this.identToken.value,
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