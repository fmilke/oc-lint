import { ITokenizer, Token, TokenType } from "../ifaces/ITokenizer";

const CC__ = "_".charCodeAt(0);
const CC_FORWARD_SLASH = "/".charCodeAt(0);
const CC_ASTERISK = "*".charCodeAt(0);
const CC_BACKSLASH = "\\".charCodeAt(0);
const CC_A = "A".charCodeAt(0);
const CC_a = "a".charCodeAt(0);
const CC_Z = "Z".charCodeAt(0);
const CC_z = "z".charCodeAt(0);
const CC_WHITE_SPACE = " ".charCodeAt(0);
const CC_LINEFEED = "\n".charCodeAt(0);
const CC_DOT = ".".charCodeAt(0);
const CC_COMMA = ",".charCodeAt(0);
const CC_SEMICOLON = ";".charCodeAt(0);

const NUM_LOWER_LIMIT = "0".charCodeAt(0) - 1;
const NUM_UPPER_LIMIT = "9".charCodeAt(0) + 1;

export class Tokenizer implements ITokenizer {

    private end: number;
    private pos: number = 0;
    private hasFinished = false;

    constructor(private readonly text: string) {
        this.end = text.length;
    }

    nextToken(): Token {
        var token = this.getToken();
        this.pos = token.end;
        return token;
    }

    hasNext() {
        return !this.hasFinished;
    }

    *[Symbol.iterator](): Iterator<Token, void> {
        while (this.hasNext())
            yield this.nextToken();
    }

    isIdentifierTokenStart(code: number): boolean {
        if (!(64 < code && code < 91) && // A-Z
            !(96 < code && code < 123)) // a-z
            return false;
        else
            return true;
    }

    getToken() {
        let token = null;

        while (token == null) {
            if (this.pos >= this.end) {
                this.hasFinished = true;
                return new Token(this.pos, this.pos, TokenType.EOF, "EOF");
            }

            let code = this.text.charCodeAt(this.pos);

            if (this.isIdentifierTokenStart(code))
                return this.readWord()

            switch (code) {
                case CC_FORWARD_SLASH:
                    const nextCode = this.text.charCodeAt(this.pos + 1);
                    if (nextCode == CC_FORWARD_SLASH) {
                        this.pos += 2;
                        this.skipLineComment();
                    }
                    else if (nextCode == CC_ASTERISK) {console.log("Block comment start")
                        this.pos += 2;
                        this.skipBlockComment();
                    }
                    else {
                        this.pos++;
                        return new Token(this.pos - 1, this.pos, TokenType.Identifier, "/");
                    }
                    break;
                case CC_DOT:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.Dot, ".");
                case CC_COMMA:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.Comma, ",");
                case CC_SEMICOLON:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.Semicolon, ";");
                case CC_WHITE_SPACE:
                case CC_LINEFEED:
                    this.skipWhitespace();
                    break;
                default:
                    this.throwInformativeMessage(code, this.pos);
            }
        }

        return token;
    }

    throwInformativeMessage(code: number, pos: number) {
        const min = Math.max(0, pos - 10);
        const max = Math.min(pos + 10, this.text.length);
        const context = this.text.substring(min, max);
        throw new Error(`Unknown charcode: ${code} (${this.text.substr(this.pos, 1)}) \nin: ${context}`);
    }

    skipLineComment() {
        while (this.text.charCodeAt(this.pos) !== CC_LINEFEED) {
            this.pos++;
        }
        this.pos++;
    }

    skipBlockComment() {
        while (
            this.text.charCodeAt(this.pos) != CC_ASTERISK &&
            this.text.charCodeAt(this.pos + 1) != CC_FORWARD_SLASH) {
            this.pos++;
        }

        this.pos += 2;
    }

    skipWhitespace() {
        let currentPos = this.pos + 1;
        let charCode = this.text.charCodeAt(currentPos);
        while (charCode == CC_WHITE_SPACE ||
            charCode == CC_LINEFEED) {
            currentPos++;
            charCode = this.text.charCodeAt(currentPos);
        }

        this.pos = currentPos;
    }

    readWord() {
        const tokenStart = this.pos;
        let currentPos = tokenStart + 1;

        while (this.isIdentifierCharCode(this.text.charCodeAt(currentPos))) {
            currentPos++;
        }

        return new Token(
            tokenStart,
            currentPos,
            TokenType.Identifier,
            this.text.substring(tokenStart, currentPos)
        )
    }

    isIdentifierCharCode(code: number) {
        if (this.isIdentifierTokenStart(code) ||
            code == CC__ ||
            (NUM_LOWER_LIMIT < code && code < NUM_UPPER_LIMIT))
            return true;

        return false;
    }

    static tokenize(text: string) {
        return Array.from(new Tokenizer(text));
    }

    static getValues(text: string) {
        return this.tokenize(text).map(token => token.value);
    }

    static getTokenTypes(text: string) {
        return this.tokenize(text).map(token => token.type);
    }
}