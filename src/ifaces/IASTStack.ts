import { IParentNode, IASTNode } from "../model/ASTNode";

export interface IASTStack {
    appendToCurrent(node: IASTNode): void;
    addToStack(node: IParentNode): void;
    propFromStack(): void
}