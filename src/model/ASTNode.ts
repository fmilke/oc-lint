import { Token } from "../ifaces/ITokenizer";

export class IdentifierNode implements IASTNode {
    constructor(public token: Token) { }

    toTestObject() {
        return this.token.value;
    }
}

export class ExpressionNode implements IASTNode {
    constructor(public expression: IASTNode | null = null) { }

    toTestObject() {
        return this.expression === null ? null : this.expression.toTestObject();
    }
}

export class ExpressionValueNode implements IASTNode {
    constructor(public readonly identToken: Token) { }

    toTestObject() {
        return this.identToken.value;
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

export class Operator1Node implements IASTNode {
    constructor(public token: Token, public expression: IASTNode) { }

    toTestObject() {
        return {
            operator: this.token.value,
            expression: this.expression.toTestObject(),
        }
    }
}

export class Operator2Node {
    constructor(
        public token: Token,
        public leftExpression: IASTNode,
        public rightExpression: IASTNode
    ) { }

    toTestObject() {
        return {
            operator: this.token.value,
            left: this.leftExpression.toTestObject(),
            right: this.rightExpression.toTestObject(),
        }
    }
}

export class ModuleNode implements IASTNode {
    public readonly keyword: IdentifierNode;
    public readonly ident: IdentifierNode;

    constructor(keywordToken: Token, identToken: Token) {
        this.keyword = new IdentifierNode(keywordToken);
        this.ident = new IdentifierNode(identToken);
    }

    toTestObject() {
        return {
            keyword: this.keyword.toTestObject(),
            identifier: this.ident.toTestObject(),
        }
    }
}

export class ParameterNode implements IASTNode {
    public readonly identifier: IdentifierNode;
    public readonly type: IdentifierNode | null;

    constructor(identToken: Token, typeToken: Token | null = null) {
        this.identifier = new IdentifierNode(identToken);
        this.type = typeToken !== null ? new IdentifierNode(typeToken) : null;
    }

    toTestObject() {
        return {
            identifier: this.identifier.toTestObject(),
            type: this.type?.toTestObject(),
        }
    }
}

export class GlobalVariableNode implements IASTNode {
    public readonly modifier: IdentifierNode;
    public readonly identifier: IdentifierNode;

    constructor(modifierToken: Token, identToken: Token) {
        this.modifier = new IdentifierNode(modifierToken);
        this.identifier = new IdentifierNode(identToken);
    }

    toTestObject() {
        return {
            identifier: this.identifier.toTestObject(),
            modifier: this.modifier.toTestObject()
        };
    }
}

export class MethodNode implements IParentNode, IASTNode {
    public readonly visibility: IdentifierNode | null = null;
    public readonly keyword: IdentifierNode;
    public readonly identifier: IdentifierNode;

    parameterList: ParameterNode[] = [];
    children: IASTNode[] = [];

    constructor(
        keywordToken: Token,
        identToken: Token,
        visibilityToken: Token | null = null,
    ) {

        if (visibilityToken !== null) {
            this.visibility = new IdentifierNode(visibilityToken);
        }

        this.keyword = new IdentifierNode(keywordToken);
        this.identifier = new IdentifierNode(identToken);
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
    constructor(
        public readonly keywordToken: Token,
        public readonly expressionNode: ExpressionNode | null = null
    ) { }

    toTestObject() {
        return {
            keyword: this.keywordToken.value,
            expression: this.expressionNode === null ? null : this.expressionNode.toTestObject(),
        }
    }
}

export class UnparsedOperatorNode {
    constructor(public token: Token) { }
}