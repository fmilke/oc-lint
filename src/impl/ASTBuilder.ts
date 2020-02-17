import { Token, TokenType } from "../ifaces/ITokenizer";
import { ASTNode, ASTMethodNode, ASTLeaf } from "../model/ASTNode";
import { ExpressionParser } from "./ExpressionParser";

export enum Scope {
    Expression,
    Root,
}

export class ASTBuilder {
    private root = ASTNode.createRoot();
    private current = this.root;
    private scope = Scope.Root;
    private stack: ASTNode[] = [this.root];

    addToStack(node: ASTNode) {
        this.stack.push(node);
        this.current = node;
    }

    popFromStack() {
        this.stack.pop();
        this.current = this.stack[this.stack.length - 1];
    }

    getRoot() {
        return this.root;
    }

    addNode(token: Token) {
        this.current.appendChild(ASTNode.fromToken(token));
    }

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
        const node = ASTNode.fromTokenWithChild(modifierToken, identToken);
        this.current.appendChild(node);
        this.addToStack(node);
    }

    startMethodNode(modifierToken: Token | null) {
        const node = new ASTMethodNode();
        if (modifierToken !== null)
            node.setModifier(modifierToken);
        this.current.appendChild(node);
        this.addToStack(node);

        return new ASTMethodNodeHandle(node);
    }

    beginReturnStatement(token: Token) {
        const node = new ASTNode(token);
        this.current.appendChild(node);
        this.addToStack(node);
    }

    finalizeReturnStatement() {

    }

    expressionNodes: ASTNode[] | null = null;
    parsedExpressionNodes: ASTNode[] = [];

    // startExpression(tokens: Token[]) {
    //     if (this.expressionNodes !== null)
    //         throw new Error("Starting expression while previous has not been finalized");

    //     this.expressionNodes = tokens.map(token => new ASTNode(token));

    //     // Add everything that is not an operator as 'parsed'
    //     this.parsedExpressionNodes.concat(...this.expressionNodes.filter(node => this.isOperatorToken(node.token)))
    // }

    startExpression() {
        const node = ASTNode.createRoot();
        this.addToStack(node);
    }

    finalizeExpression() {
        const subParser = new ExpressionParser(this.current.children);
        subParser.parse();
        this.popFromStack();
    }

    abortExpression() {
        this.popFromStack();   
    }
}

export class ASTMethodNodeHandle {
    constructor(private node: ASTMethodNode) { }

    setMethodName(token: Token) {
        if (this.node.hasMethodName())
            return false;
        else {
            this.node.setMethodName(token);
            return true;
        }
    }

    addParameter(token: Token) {
        this.node.addParameter(token);
    }

    addParameterWithType(typeToken: Token, identToken: Token) {
        this.node.addParameterWithType(typeToken, identToken);
    }
}