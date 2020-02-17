import { Token } from "../ifaces/ITokenizer";
import { ASTNode, ASTMethodNode } from "../model/ASTNode";
import { PrecedenceParser } from "./PrecedenceParser";

export class ASTBuilder {
    private root = ASTNode.createRoot();
    private current = this.root;
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
        console.log(this.root.toDebugString());
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

    startExpression() {
        const node = ASTNode.createRoot();
        this.current.appendChild(node);
        this.addToStack(node);
    }

    finalizeExpression() {
        console.log(this.current.toDebugString());
        const subParser = new PrecedenceParser(this.current.children);
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