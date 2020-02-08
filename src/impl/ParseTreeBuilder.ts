import { IParseTreeBuilder, ParseTreeNode } from "../ifaces/IParserTreeBuilder";
import { ITokenizer, TokenType, Token } from "../ifaces/ITokenizer";
import { UnreachableCaseError } from "../errors";


export class ParseTreeBuilder implements IParseTreeBuilder {
    constructor(private tokenizer: ITokenizer) {}

    tokensToParseTree(): ParseTreeNode {

        const rootToken = new Token(0, 0, TokenType.Root, "");
        const root = new ParseTreeNode(rootToken);
        let currentNode = root;
        let domainNode = root;

        const n = [root];

        for (let token of this.tokenizer) {
            switch (token.type) {
                case TokenType.Dot:
                    currentNode = this.pushToNode(token, currentNode);
                    break;
                case TokenType.Identifier:
                    currentNode = this.pushToNode(token, currentNode);
                    break;
                case TokenType.Comma:
                    this.pushToNode(token, domainNode);
                    currentNode = domainNode;
                    break;
                case TokenType.Curly_Paren_L:
                case TokenType.Bracket_L:
                case TokenType.Round_Paren_L:
                    currentNode = domainNode = this.pushToNode(token, currentNode);
                    break;
                case TokenType.Curly_Paren_R:
                case TokenType.Bracket_R:
                case TokenType.Round_Paren_R:
                    // domainNode = currentNode = domainStack.pop();
                    break;
                case TokenType.ArithmicOperator:
                case TokenType.AssignmentOperator:
                case TokenType.BitwiseOperator:
                case TokenType.NilCaseOperator:
                case TokenType.LogicalOperator:
                case TokenType.HashIdentifier:
                case TokenType.EOF:
                case TokenType.Number:
                case TokenType.String:
                case TokenType.Semicolon:
                case TokenType.Root:
                    break
                case TokenType.Unimplemented:
                    throw new Error(`TokenType is 'Unimplemented' for ${token.value}`);
                default:
                    console.log("Unimplemented: " + token.type);
                //     throw new UnreachableCaseError(token);
            }
        }

        return root;
    }

    private pushToNode(token: Token, node: ParseTreeNode) {
        const childNode = new ParseTreeNode(token);
        if (node.children == null) {
            node.children = [childNode];
        }
        else
            node.children.push(childNode);

        return node;
    }
}