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
}