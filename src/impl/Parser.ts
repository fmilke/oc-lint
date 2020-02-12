import { ITokenizer, TokenType, Token } from "../ifaces/ITokenizer";
import { ASTBuilder } from "./ASTBuilder";
import { IParser } from "../ifaces/IParser";
import { ParseError } from "../model/ParseError";
import { IDiagnosticsCache } from "../ifaces/IErrorCache";

export class Parser implements IParser {
    private staged = new Token(0, 0, TokenType.Root, "");
    private errors: ParseError[] = [];

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

    private parseGlobalVariable()
    {
        const modifier = this.staged;
        this.stageNext();
        const maybeIdent = this.staged;

        if (maybeIdent.type === TokenType.Identifier) {
            const eqOrSemicolon = this.stageNext();

            if (eqOrSemicolon.type === TokenType.Semicolon) {
                this.builder.addGlobalVariable(modifier, maybeIdent);
            }
            else if(eqOrSemicolon.value === "=") {
                this.builder.startGlobalVariableAssignment(modifier, maybeIdent);
                this.stageNext();
                this.parseExpression();
                
            }
            else {
                this.diagnostics.raiseError(eqOrSemicolon, "Assignment or ';' expected.")
            }
        }
        else {
            this.diagnostics.raiseError(maybeIdent, "Missing identifier.");
        }
    }

    private parseExpression() {
        const first = this.staged;

        if (first.type === TokenType.Identifier) {
            this.builder.addNode(first);
        }
        else {
            throw new Error("Unimplemented");
        }
    }

    private stageNext() {
        this.staged = this.tokenizer.nextToken();
        return this.staged;
    }

    private isGlobalVariableModifier(value: string) {
        return value == "static" ||
            value == "local";
    }
}