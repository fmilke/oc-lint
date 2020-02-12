import { ITokenizer, TokenType, Token } from "../ifaces/ITokenizer";
import { ASTBuilder } from "./ASTBuilder";

export class Parser {
    staged = new Token(0, 0, TokenType.Root, "");
    constructor(private tokenizer: ITokenizer, private builder: ASTBuilder) {}

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

    private stageNext() {
        this.staged = this.tokenizer.nextToken();
    }
}