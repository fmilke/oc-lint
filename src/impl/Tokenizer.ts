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
const CC_PLUS = "+".charCodeAt(0);
const CC_MINUS = "-".charCodeAt(0);
const CC_PRECENTAGE = "%".charCodeAt(0);
const CC_DOUBLE_QUOTE = '"'.charCodeAt(0);
const CC_SINGLE_QUOTE = "'".charCodeAt(0);
const CC_EQL_SIGN = "=".charCodeAt(0);
const CC_LT_SIGN = "<".charCodeAt(0);
const CC_GT_SIGN = ">".charCodeAt(0);
const CC_TILDE = "~".charCodeAt(0);
const CC_VERT_LINE = "|".charCodeAt(0);
const CC_AMPERSAND = "&".charCodeAt(0);
const CC_CIRCUMFLEX = "^".charCodeAt(0);

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
        let nextCode: number;

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
                    nextCode = this.text.charCodeAt(this.pos + 1);
                    if (nextCode == CC_FORWARD_SLASH) {
                        this.pos += 2;
                        this.skipLineComment();
                    }
                    else if (nextCode == CC_ASTERISK) {
                        this.pos += 2;
                        this.skipBlockComment();
                    }
                    else if (nextCode == CC_EQL_SIGN) {
                        this.pos += 2;
                        return new Token(this.pos - 2, this.pos, TokenType.AssignmentOperator, "/=");
                    }
                    else {
                        this.pos++;
                        return new Token(this.pos - 1, this.pos, TokenType.ArithmicOperator, "/");
                    }
                    break;
                case CC_DOUBLE_QUOTE:
                    this.pos++;
                    return this.readString(this.pos - 1);
                case CC_DOT:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.Dot, ".");
                case CC_COMMA:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.Comma, ",");
                case CC_SEMICOLON:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.Semicolon, ";");
                case CC_EQL_SIGN:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.AssignmentOperator, "=");
                case CC_PLUS:
                case CC_MINUS:
                case CC_PRECENTAGE:
                    nextCode = this.text.charCodeAt(this.pos + 1);
                    if (nextCode == CC_EQL_SIGN) {
                        this.pos += 2;
                        return new Token(this.pos - 2, this.pos, TokenType.AssignmentOperator, this.text.substr(this.pos - 2, 2));
                    }
                    else {
                        this.pos++;
                        return new Token(this.pos - 1, this.pos, TokenType.ArithmicOperator, this.text.substr(this.pos - 1, 1));
                    }
                case CC_ASTERISK:
                    nextCode = this.text.charCodeAt(this.pos + 1);
                    if (nextCode == CC_ASTERISK) {
                        this.pos += 2;
                        return new Token(this.pos - 2, this.pos, TokenType.ArithmicOperator, "**");
                    }
                    else if (nextCode == CC_EQL_SIGN) {
                        this.pos += 2;
                        return new Token(this.pos - 2, this.pos, TokenType.AssignmentOperator, "*=");
                    }
                    else {
                        this.pos++;
                        return new Token(this.pos - 1, this.pos, TokenType.ArithmicOperator, "*");
                    }
                case CC_LT_SIGN:
                case CC_GT_SIGN:
                    nextCode = this.text.charCodeAt(this.pos + 1);
                    if (nextCode == code) {
                        this.pos += 2;
                        return new Token(this.pos - 2, this.pos, TokenType.BitwiseOperator, this.text.substr(this.pos - 2, 2));
                    }
                    else {
                        this.pos++;
                        return new Token(this.pos - 1, this.pos, TokenType.Unimplemented, this.text.substr(this.pos - 1, 1));
                    }
                case CC_AMPERSAND:
                case CC_VERT_LINE:
                    nextCode = this.text.charCodeAt(this.pos + 1);
                    if (nextCode == code) {
                        this.pos += 2;
                        return new Token(this.pos - 2, this.pos, TokenType.Unimplemented, this.text.substr(this.pos - 2, 2));
                    }
                    else {
                        this.pos++;
                        return new Token(this.pos - 1, this.pos, TokenType.BitwiseOperator, this.text.substr(this.pos - 1, 1));
                    }
                case CC_TILDE:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.BitwiseOperator, "~");
                case CC_CIRCUMFLEX:
                    this.pos++;
                    return new Token(this.pos - 1, this.pos, TokenType.BitwiseOperator, "^");
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

    readString(tokenStart: number) {
        while (this.text.charCodeAt(this.pos) != CC_DOUBLE_QUOTE) {
            this.pos++;
        }

        this.pos++;

        return new Token(
            tokenStart,
            this.pos,
            TokenType.String,
            this.text.substring(tokenStart, this.pos)
        )
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