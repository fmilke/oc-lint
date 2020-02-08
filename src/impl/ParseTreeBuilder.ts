import { IParseTreeBuilder, ParseTreeNode } from "../ifaces/IParserTreeBuilder";
import { ITokenizer, TokenType, Token } from "../ifaces/ITokenizer";
import { UnreachableCaseError } from "../errors";
import { notDeepEqual } from "assert";


export class ParseTreeBuilder implements IParseTreeBuilder {

    private root = new ParseTreeNode(new Token(0, 0, TokenType.Root, "root"));
    private currentNode = this.root;
    private domainNode = this.root;
    private domainStack = [this.root];

    constructor(private tokenizer: ITokenizer) { }

    tokensToParseTree(): ParseTreeNode {
        let childNode;

        for (let token of this.tokenizer) {
            switch (token.type) {
                case TokenType.Dot:
                    this.addToCurrent(token);
                    break;
                case TokenType.Identifier:
                    childNode = this.addToCurrent(token);
                    this.setDomain(childNode)
                    break;
                case TokenType.Semicolon:
                case TokenType.Comma:
                    this.switchToDomain();
                    childNode = this.addToCurrent(token);
                    break;
                case TokenType.Curly_Paren_L:
                case TokenType.Bracket_L:
                case TokenType.Round_Paren_L:
                    this.addToCurrent(token);
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
                    break
                case TokenType.Number:
                case TokenType.String:
                    this.addToCurrent(token);
                    break;
                case TokenType.Root:
                    break
                case TokenType.Unimplemented:
                    throw new Error(`TokenType is 'Unimplemented' for ${token.value}`);
                default:
                    throw new Error(`TokenType is unmatched in switch statement for ${token.value}`);
            }
        }

        return this.root;
    }

    private createNodeFromToken(token: Token) {
        return new ParseTreeNode(token);
    }

    private switchToDomain() {
        this.currentNode = this.domainNode;
    }

    private setDomain(node: ParseTreeNode) {
        this.domainNode = node;
    }

    private addToCurrent(token: Token) {
        const node = this.createNodeFromToken(token);
        this.currentNode.appendChild(node);
        return node;
    }
}