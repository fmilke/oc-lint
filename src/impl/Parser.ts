import { ITokenizer, TokenType, Token } from "../ifaces/ITokenizer";
import { IParser } from "../ifaces/IParser";
import { IDiagnosticsCache } from "../ifaces/IDiagnosticsCache";
import { appContainer } from "../app";
import { IASTStack } from "../ifaces/IASTStack";
import { ModuleNode, RootNode, ReturnStatementNode, ExpressionNode, MethodNode, GlobalVariableNode, ParameterNode } from "../model/ASTNode";

export class Parser implements IParser {
    private staged = new Token(0, 0, TokenType.Unimplemented, "");
    public root: RootNode;
    private _stack = appContainer.resolve<IASTStack>("ASTStack");

    constructor(
        private tokenizer: ITokenizer,
        private diagnostics: IDiagnosticsCache,
    ) {
        this.root = new RootNode();
        this._stack.addToStack(this.root);
    }

    parse() {
        this.parseTopLevel();
    }

    private parseTopLevel() {

        let node;

        for (let token of this.tokenizer) {
            this.staged = token;
            switch (token.type) {
                case TokenType.HashIdentifier:
                    this.parseModule();
                    break;
                case TokenType.Identifier:
                    if (this.isGlobalVariableModifier(token.value)) {
                        node = this.parseGlobalVariable();
                        if (node !== null)
                            this._stack.appendToCurrent(node);
                    }
                    else if (this.isMethodModifier(token.value)) {
                        node = this.parseMethod(this.stageNext(), token);
                        if (node !== null) {
                            this._stack.appendToCurrent(node);
                            this._stack.addToStack(node);
                        }
                    }
                    else if (token.value === "func") {
                        node = this.parseMethod(token);
                        if (node !== null) {
                            this._stack.appendToCurrent(node);
                            this._stack.addToStack(node);
                        }
                    }
                    else if (token.value === "return") {
                        this.stageNext();
                        node = this.parseReturn(token);
                        if (node !== null)
                            this._stack.appendToCurrent(node);
                    }
                    else {
                        this.diagnostics.raiseError(token, "Unexpected identifier.")
                    }
                    break;
            }
        }
    }

    // e.g. #appendto Clonk
    private parseModule() {
        const keyword = this.staged;
        const next = this.stageNext();

        if (next.type === TokenType.Identifier) {
            const node = new ModuleNode(keyword, next);
            this._stack.appendToCurrent(node);
        }
        else {
            this.diagnostics.raiseError(next, `Identifier expected got ${next.value}`);
        }
    }

    private parseGlobalVariable() {
        const modifier = this.staged;
        const maybeIdent = this.stageNext();

        if (maybeIdent.type === TokenType.Identifier) {
            const eqOrSemicolon = this.stageNext();

            if (eqOrSemicolon.value === "=") {
                // TODO: Add expression
                return new GlobalVariableNode(modifier, maybeIdent);
            }
            else if (eqOrSemicolon.value === ";") {
                return new GlobalVariableNode(modifier, maybeIdent);
            }
            else {
                this.diagnostics.raiseError(eqOrSemicolon, "Expected '=' or ';'");
            }
        }
        else {
            this.diagnostics.raiseError(maybeIdent, "Identifier expected");
        }

        return null;
    }

    private parseReturn(keywordToken: Token) {
        const expressionNode = this.parseExpression();

        const node = new ReturnStatementNode(keywordToken, expressionNode);

        const maybeSemicolon = this.staged;

        if (maybeSemicolon.type !== TokenType.Semicolon) {
            this.diagnostics.raiseError(maybeSemicolon, "Expected ';'");
        }

        return node;
    }

    private parseExpression() {
        return new ExpressionNode();
    }

    // parsing of expression is done by
    // consuming all tokens until a delimiter is reached
    // and then perform precedence parsing on these tokens
    // private _parseExpression() {
    //     let current = this.staged;
    //     let level = 0;

    //     this.builder.startExpression();

    //     while (level >= 0 && !this.isExpressionDelimiter(current.type)) {
    //         let next = this.stageNext();
    //         switch (current.type) {
    //             case TokenType.ArithmicOperator:
    //             case TokenType.NilCaseOperator:
    //             case TokenType.AssignmentOperator:
    //             case TokenType.BitwiseOperator:
    //             case TokenType.LogicalOperator:
    //                 this.builder.addNode(current);
    //                 break;
    //             case TokenType.Identifier:
    //                 this.builder.addNode(current);
    //                 break;
    //             case TokenType.Round_Paren_L:
    //                 this.builder.startExpression();
    //                 level++;
    //                 break;
    //             case TokenType.Round_Paren_R:
    //                 if (level > 0) {
    //                     this.builder.finalizeExpression();
    //                 }
    //                 level--;
    //             break;
    //             // case TokenType.Semicolon:
    //             // case TokenType.Comma:
    //             // case TokenType.EOF:
    //             //     break;
    //             default:
    //                 this.diagnostics.raiseError(next, "Unexpected token: " + next.value);
    //                 this.builder.abortExpression();
    //                 return;
    //         }

    //         current = next;
    //     }

    //     this.builder.finalizeExpression();
    // }

    private stageNext() {
        this.staged = this.tokenizer.nextToken();
        return this.staged;
    }

    private isGlobalVariableModifier(value: string) {
        return value == "static" ||
            value == "local";
    }

    private isMethodModifier(value: string) {
        switch (value) {
            case "public":
            case "protected":
            case "global":
                return true;
            default: return false;
        }
    }

    private isDataType(value: string) {
        switch (value) {
            case "object":
            case "proplist":
            case "effect":
            case "int":
            case "string":
            case "array":
            case "bool":
            case "func":
            case "nil":
            case "any":
            case "def":
                return true;
            default: return false;
        }
    }

    isExpressionDelimiter(type: TokenType): boolean {
        return type === TokenType.Semicolon ||
            type === TokenType.Comma ||
            type === TokenType.EOF;
    }

    private parseMethod(keywordToken: Token, visiblityToken?: Token) {
        const next = this.stageNext();

        let node: MethodNode | null = null;

        if (next.type === TokenType.Identifier) {
            node = new MethodNode(keywordToken, next, visiblityToken);

            this.stageNext();
            const parameters = this.parseParameters();

            if (parameters !== null) {
                node.setParameters(parameters);
            }
        }

        return node;
    }

    private parseParameters() {
        const lParen = this.staged;
        const result = [];

        if (lParen.type !== TokenType.Round_Paren_L) {
            this.diagnostics.raiseError(lParen, "Expected '('");
            return null;
        }

        let next = this.stageNext();

        while (next.type === TokenType.Identifier) {
            const commaOrIdent = this.stageNext();

            if (commaOrIdent.type === TokenType.Comma) {
                result.push(new ParameterNode(next));
            }
            else if (commaOrIdent.type === TokenType.Identifier) {
                if (!this.isDataType(next.value)) {
                    this.diagnostics.raiseError(next, "Unexpected identifier. Expected type");
                }

                result.push(new ParameterNode(commaOrIdent, next));
            }
            else if (commaOrIdent.type === TokenType.Round_Paren_R) {
                break;
            }
            else {
                this.diagnostics.raiseError(commaOrIdent, `Expected ',' or identifier; got: ${commaOrIdent.value}`);
                return null;
            }

            next = this.stageNext();
        }

        return result;
    }
}