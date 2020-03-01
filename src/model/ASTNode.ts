import { Token, TokenType } from "../ifaces/ITokenizer";

// export class ASTNode {
//     children: ASTNode[] = [];

//     protected _parent: ASTNode | null = null;

//     get parent() {
//         return this._parent;
//     }

//     constructor(public token: Token) { }

//     public appendChild(node: ASTNode) {
//         this.children.push(node);

//         if (node._parent !== null) {
//             node._parent.removeChild(node);
//         }

//         node._parent = this;
//     }

//     public removeChild(node: ASTNode) {
//         const idx = this.children.indexOf(node);
//         if (idx === -1)
//             throw new Error("Trying to remove node which is not a child");

//         this.children.splice(idx, 1);
//         node._parent = null;
//     }

//     public replaceChild(oldChild: ASTNode, newChild: ASTNode) {
//         const idx = this.children.indexOf(oldChild);

//         if (idx === -1)
//             throw new Error("Trying to replace node which is not a child");

//         this.children[idx] = newChild;
//         oldChild._parent = null;
//         newChild.removeSafelyFromParent();
//         newChild._parent = this;
//     }

//     public removeSafelyFromParent() {
//         if (this._parent !== null)
//             this._parent.removeChild(this);
//     }

//     public getRoot(): ASTNode | null {
//         return this._parent !== null ? this._parent.getRoot() : this;
//     }

//     static fromTokenWithChild(parentToken: Token, childToken: Token) {
//         const parent = new ASTNode(parentToken);
//         parent.appendChild(new ASTNode(childToken));
//         return parent;
//     }

//     static fromToken(token: Token) {
//         return new ASTNode(token);
//     }

//     static createRoot() {
//         return new ASTNode(new Token(0, 0, TokenType.Root, "root"));
//     }

//     static createExpression() {
//         return new ASTNode(new Token(0, 0, TokenType.Root, "expression"));
//     }

//     toTestObject(): any {
//         return {
//             value: this.token.value,
//             children: this.children.map(child => child.toTestObject()),
//         };
//     }

//     toDebugString(level: number = 0) {
//         let str = `${'-'.padStart(level * 2, " ")}${this.token.value}\n`;
//         for (let child of this.children) {
//             str += child.toDebugString(level + 1);
//         }

//         return str;
//     }
// }

// export class ASTLeaf {
//     constructor(public token: Token) { }
//     toTestObject(): any {
//         return this.token.value;
//     }
// }

// export class ASTParameterLeaf extends ASTLeaf {
//     constructor(protected identToken: Token, private typeToken?: Token) {
//         super(identToken);
//     }

//     toTestObject() {
//         return {
//             value: this.identToken.value,
//             type: this.typeToken ? this.typeToken.value : null,
//         }
//     }
// }

// export class ASTMethodNode extends ASTNode {
//     private parameters: ASTParameterLeaf[] = [];
//     private modifier: ASTLeaf | null = null;
//     constructor() {
//         super(new Token(0, 0, TokenType.Identifier, ""));
//     }

//     setMethodName(token: Token) {
//         this.token = token;
//     }

//     addParameter(identToken: Token) {
//         this.parameters.push(new ASTParameterLeaf(identToken));
//     }

//     addParameterWithType(typeToken: Token, identToken: Token) {
//         this.parameters.push(new ASTParameterLeaf(identToken, typeToken));
//     }

//     setModifier(modifierToken: Token | null) {
//         this.modifier = modifierToken === null ? null : new ASTLeaf(modifierToken);
//     }

//     hasMethodName() {
//         return this.token.value !== "";
//     }

//     toTestObject() {
//         return {
//             parameters: this.parameters.map(child => child.toTestObject()),
//             modifier: this.modifier !== null ? this.modifier.toTestObject() : null,
//             value: this.token.value,
//             children: this.children.map(child => child.toTestObject()),
//         }
//     }
// }


export class ASTNode implements IASTNode {
    constructor(public token: Token) { }

    toTestObject() {
        return this.token.value;
    }
}

export class ExpressionNode implements IASTNode {
    constructor() { }

    toTestObject() {
        return "[expression]";
    }
}

export type OperatorNode = Operator1Node | Operator2Node;

export interface IASTNode {
    toTestObject(): any;
}

export interface IParentNode {
    appendChild(node: IASTNode): void;
}

export class ParentNode implements IParentNode, IASTNode {
    public children: IASTNode[] = [];

    appendChild(node: IASTNode): void {
        this.children.push(node);
    }

    toTestObject() {
        return {
            children: this.children.map(child => child.toTestObject()),
        }
    }
}

export class RootNode extends ParentNode implements IASTNode {
    toTestObject() {
        return {
            children: this.children.map(child => child.toTestObject()),
        }
    }
}

export class Operator1Node {
    constructor() { }
}

export class Operator2Node {

}

export class ModuleNode implements IASTNode {
    keyword: ASTNode;
    ident: ASTNode;

    constructor(keywordToken: Token, identToken: Token) {
        this.keyword = new ASTNode(keywordToken);
        this.ident = new ASTNode(identToken);
    }

    toTestObject() {
        return {
            keyword: this.keyword.toTestObject(),
            identifier: this.ident.toTestObject(),
        }
    }
}

export class ParameterNode implements IASTNode {
    public identifier: ASTNode;
    public type: ASTNode | null;

    constructor(identToken: Token, typeToken: Token | null = null) {
        this.identifier = new ASTNode(identToken);
        this.type = typeToken !== null ? new ASTNode(typeToken) : null;
    }

    toTestObject() {
        return {
            identifier: this.identifier.toTestObject(),
            type: this.type?.toTestObject(),
        }
    }
}

export class GlobalVariableNode implements IASTNode {
    public modifier: ASTNode;
    public identifier: ASTNode;

    constructor(modifierToken: Token, identToken: Token) {
        this.modifier = new ASTNode(modifierToken);
        this.identifier = new ASTNode(identToken);
    }

    toTestObject() {
        return {
            identifier: this.identifier.toTestObject(),
            modifier: this.modifier.toTestObject()
        };
    }
}

export class MethodNode implements IParentNode, IASTNode {
    parameterList: ParameterNode[] = [];
    visibility: ASTNode | null = null;
    keyword: ASTNode;
    identifier: ASTNode;
    children: IASTNode[] = [];

    constructor(
        keywordToken: Token,
        identToken: Token,
        visibilityToken: Token | null = null,
    ) {

        if (visibilityToken !== null) {
            this.visibility = new ASTNode(visibilityToken);
        }

        this.keyword = new ASTNode(keywordToken);
        this.identifier = new ASTNode(identToken);
    }

    setParameters(parameterList: ParameterNode[]) {
        this.parameterList = parameterList;
    }

    addParameter(node: ParameterNode) {
        this.parameterList.push(node);
    }

    appendChild(node: IASTNode): void {
        this.children.push(node);
    }

    toTestObject() {
        return {
            children: this.children.map(child => child.toTestObject()),
            parameters: this.parameterList.map(par => par.toTestObject()),
            visibility: this.visibility === null ? null : this.visibility.toTestObject(),
            identifier: this.identifier.toTestObject(),
            keyword: this.keyword.toTestObject(),
        }
    }
}

export class ReturnStatementNode implements IASTNode {
    constructor(public keywordToken: Token, public expressionNode: ExpressionNode) { }

    toTestObject() {
        return {
            keyword: this.keywordToken.value,
            expression: this.expressionNode.toTestObject(),
        }
    }
}