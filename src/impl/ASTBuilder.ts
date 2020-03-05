import { IParentNode, IASTNode } from "../model/ASTNode";
import { IASTStack } from "../ifaces/IASTStack";

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