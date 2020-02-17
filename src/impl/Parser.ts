import { ITokenizer, TokenType, Token } from "../ifaces/ITokenizer";
import { ASTBuilder, ASTMethodNodeHandle } from "./ASTBuilder";
import { IParser } from "../ifaces/IParser";
import { IDiagnosticsCache } from "../ifaces/IErrorCache";

enum Scope {
    Expression,
    Root,
    FunctionBody,
}

export class Parser implements IParser {
    private staged = new Token(0, 0, TokenType.Root, "");
    private scope: Scope = Scope.Root; 

    constructor(
        private tokenizer: ITokenizer,
        private builder: ASTBuilder,
        private diagnostics: IDiagnosticsCache,
    ) { }

    parse() {
        this.parseTopLevel();
    }

    private parseTopLevel() {
        for (let token of this.tokenizer) {
            this.staged = token;
            switch (token.type) {
                case TokenType.HashIdentifier:
                    this.parseModule();
                    break;
                case TokenType.Identifier:
                    if (this.isGlobalVariableModifier(token.value))
                        this.parseGlobalVariable();
                    else if (this.isMethodModifier(token.value)) {
                        this.stageNext();
                        this.parseMethod(token);
                    }
                    else if (token.value === "func") {
                        this.parseMethod();
                    }
                    else if (token.value === "return") {
                        this.stageNext();
                        this.parseReturn(token);
                    }
                    else {
                        this.diagnostics.raiseError(token, "Unexpected identifier.")
                    }
                    break;
            }
        }
    }

    // #appendto Clonk
    private parseModule() {
        const hashIdent = this.staged;
        this.stageNext();

        if (this.staged.type === TokenType.Identifier) {
            this.builder.addHashIdentifierNode(hashIdent, this.staged);
        }
    }

    private parseGlobalVariable() {
        const modifier = this.staged;
        this.stageNext();
        const maybeIdent = this.staged;

        if (maybeIdent.type === TokenType.Identifier) {
            const eqOrSemicolon = this.stageNext();

            if (eqOrSemicolon.type === TokenType.Semicolon) {
                this.builder.addGlobalVariable(modifier, maybeIdent);
            }
            else if (eqOrSemicolon.value === "=") {
                this.builder.startGlobalVariableAssignment(modifier, maybeIdent);
                this.stageNext();
                this.parseExpression();
                // TODO: read ; and jump back
            }
            else {
                this.diagnostics.raiseError(eqOrSemicolon, "Assignment or ';' expected.")
            }
        }
        else {
            this.diagnostics.raiseError(maybeIdent, "Missing identifier.");
        }
    }

    private parseReturn(returnToken: Token) {
        this.builder.beginReturnStatement(returnToken);
        this.parseExpression();

        const maybeSemicolon = this.staged;

        if (maybeSemicolon.type === TokenType.Semicolon) {
            this.builder.finalizeReturnStatement();
        }
        else {
            this.builder.finalizeReturnStatement();
            this.diagnostics.raiseError(maybeSemicolon, "Expected ';'");
        }
    }

    // parsing of expression is done by
    // consuming all tokens until a delimiter is reached
    // and then perform precedence parsing on these tokens
    private parseExpression() {
        let current = this.staged;
        let level = 0;

        this.builder.startExpression();

        while (level >= 0 && !this.isExpressionDelimiter(current.type)) {
            let next = this.stageNext();
            switch (current.type) {
                case TokenType.ArithmicOperator:
                case TokenType.NilCaseOperator:
                case TokenType.AssignmentOperator:
                case TokenType.BitwiseOperator:
                case TokenType.LogicalOperator:
                    this.builder.addNode(current);
                    break;
                case TokenType.Identifier:
                    this.builder.addNode(current);
                    break;
                default:
                    this.builder.abortExpression();
                    return;
            }

            current = next;
        }

        this.builder.finalizeExpression();
    }

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

    private parseMethod(modifierToken?: Token) {
        const handle = this.builder.startMethodNode(modifierToken || null);
        let next = this.stageNext();

        if (next.type === TokenType.Identifier) {
            if (!handle.setMethodName(next)) {
                this.diagnostics.raiseError(next, "Unexpected identifier.");
                return;
            }
        }
        else if (next.type === TokenType.Round_Paren_L) {
            this.stageNext();
            return this.parseParameters(handle);
        }

        next = this.stageNext();
        if (next.type === TokenType.Round_Paren_L) {
            this.stageNext();
            return this.parseParameters(handle);
        }
    }

    private parseParameters(handle: ASTMethodNodeHandle) {
        const first = this.staged;

        if (first.type === TokenType.Round_Paren_R)
            return;
        else if (first.type === TokenType.Comma) {
            this.diagnostics.raiseError(first, "Unexpected ','.");
            this.stageNext();
            this.parseParameters(handle);
            return;
        }
        else if (first.type !== TokenType.Identifier) {
            this.diagnostics.raiseError(first, "Expecting type or identifier.");
            return;
        }

        const next = this.stageNext();

        if (next.type === TokenType.Comma) {
            handle.addParameter(first);
            this.stageNext();
            this.parseParameters(handle);
        }
        else if (next.type === TokenType.Identifier) {
            if (this.isDataType(first.value)) {
                handle.addParameterWithType(first, next);
                this.stageNext();
                this.parseParameters(handle);
            }
            else {
                this.diagnostics.raiseError(first, "Expected type got " + first.value);
                this.stageNext();
                this.parseParameters(handle);
            }
        }
    }
}