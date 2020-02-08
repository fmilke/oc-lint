import { ITokenizer } from "../../src/ifaces/ITokenizer";
import { ParseTreeBuilder } from "../../src/impl/ParseTreeBuilder";
import { ParseTreeNode } from "../../src/ifaces/IParserTreeBuilder";

export class ParseTreeHelper {
    static getValueTree(tokenizer: ITokenizer) {
        const tree = new ParseTreeBuilder(tokenizer).tokensToParseTree();

        const fn = (node: ParseTreeNode): any => {
            return node.children === null ? node.token.value : {
                [node.token.value]: node.children.map(fn),
            };
        };

        return fn(tree);
    }
}