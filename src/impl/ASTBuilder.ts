import { Token, TokenType } from "../ifaces/ITokenizer";
import { ASTNode } from "../model/ASTNode";

export enum Scope {
    Expression,
    Root,
}

export class ASTBuilder {
    private root = ASTNode.createRoot();
    private current = this.root;
    private scope = Scope.Root;
    private stack: ASTNode[] = [this.root];

    constructor() { }

    addHashIdentifierNode(hashIdentToken: Token, identToken: Token) {
        this.current.appendChild(
            ASTNode.fromTokenWithChild(hashIdentToken, identToken)
        );
    }

    addGlobalVariable(modifierToken: Token, identToken: Token) {
        this.current.appendChild(
            ASTNode.fromTokenWithChild(modifierToken, identToken)
        );
    }

    startGlobalVariableAssignment(
        modifierToken: Token,
        identToken: Token,
    ) {
        console.log(this.current);
        const node = ASTNode.fromTokenWithChild(modifierToken, identToken);
        this.current.appendChild(node);
        console.log(this.current);
        this.addToStack(node);
        console.log(this.current);
    }

    addNode(token: Token) {
        this.current.appendChild(ASTNode.fromToken(token));
    }

    addToStack(node: ASTNode) {
        this.stack.push(node);
        this.current = node;
    }

    popFromStack() {
        this.stack.pop();
        this.current = this.stack[this.stack.length - 1];
    }

    getAST() {
        return this.root;
    }
}