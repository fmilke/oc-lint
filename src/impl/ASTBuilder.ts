import { Token } from "../ifaces/ITokenizer";
import { ASTNode, IParentNode, IASTNode, RootNode } from "../model/ASTNode";
import { PrecedenceParser } from "./PrecedenceParser";
import { IASTStack } from "../ifaces/IASTStack";

// export class ASTBuilder {
//     private root = new RootNode();
//     private current = this.root;
//     private stack: ASTNode[] = [this.root];
//     private expressionCollectionStack: ASTNode[][] = [];
//     private currentExpressionCollection: ASTNode[] | null = null;

//     addToStack(node: ASTNode) {
//         this.stack.push(node);
//         this.current = node;
//     }

//     popFromStack() {
//         this.stack.pop();
//         this.current = this.stack[this.stack.length - 1];
//     }

//     getRoot() {
//         return this.root;
//     }

//     addNode(token: Token) {
//         this.current.appendChild(ASTNode.fromToken(token));
//     }

//     addHashIdentifierNode(hashIdentToken: Token, identToken: Token) {
//         this.current.appendChild(
//             ASTNode.fromTokenWithChild(hashIdentToken, identToken)
//         );
//     }

//     addGlobalVariable(modifierToken: Token, identToken: Token) {
//         this.current.appendChild(
//             ASTNode.fromTokenWithChild(modifierToken, identToken)
//         );
//     }

//     startGlobalVariableAssignment(
//         modifierToken: Token,
//         identToken: Token,
//     ) {
//         const node = ASTNode.fromTokenWithChild(modifierToken, identToken);
//         this.current.appendChild(node);
//         this.addToStack(node);
//     }

//     startMethodNode(modifierToken: Token | null) {
//         const node = new ASTMethodNode();
//         if (modifierToken !== null)
//             node.setModifier(modifierToken);
//         this.current.appendChild(node);
//         this.addToStack(node);

//         return new ASTMethodNodeHandle(node);
//     }

//     beginReturnStatement(token: Token) {
//         const node = new ASTNode(token);
//         this.current.appendChild(node);
//         this.addToStack(node);
//     }

//     finalizeReturnStatement() {

//     }

//     startExpression() {
//         const node = ASTNode.createExpression();
//         this.current.appendChild(node);
//         this.addToStack(node);
//     }

//     finalizeExpression() {
//         this.popFromStack();
//     }

//     abortExpression() {
//         this.popFromStack();
//     }
// }

// export class ASTMethodNodeHandle {
//     constructor(private node: ASTMethodNode) { }

//     setMethodName(token: Token) {
//         if (this.node.hasMethodName())
//             return false;
//         else {
//             this.node.setMethodName(token);
//             return true;
//         }
//     }

//     addParameter(token: Token) {
//         this.node.addParameter(token);
//     }

//     addParameterWithType(typeToken: Token, identToken: Token) {
//         this.node.addParameterWithType(typeToken, identToken);
//     }
// }

export class ASTStack implements IASTStack {
    
    private _stack: IParentNode[] = [];

    appendToCurrent(node: IASTNode) {
        if (this._stack.length === 0)
            throw new Error("Cannot append to stack item. The stack is empty.");
    
        this._stack[this._stack.length - 1].appendChild(node);
    }

    addToStack(node: IParentNode) {
        this._stack.push(node);
    }

    propFromStack() {
        this._stack.pop();
    }
}