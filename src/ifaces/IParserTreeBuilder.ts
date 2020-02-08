import { ITokenizer, Token } from "./ITokenizer";


export interface IParseTreeBuilder {
    tokensToParseTree(tokenizer: ITokenizer): ParseTreeNode;
}

export class ParseTreeNode {
    children: ParseTreeNode[] | null = null;
    token: Token;

    constructor(token: Token) {
        this.token = token;
    }

    appendChild(node: ParseTreeNode) {
        if (this.children === null) {
            this.children = [node];
        }
        else {
            this.children.push(node);
        }
    }
}