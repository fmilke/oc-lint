import { ITokenizer, Token, TokenType } from "../ifaces/ITokenizer";
import { DocumentString } from "../DocumentString";

const CC__ = "_".charCodeAt(0);
const CC_SLASH = "\\".charCodeAt(0);
const CC_A = "A".charCodeAt(0);
const CC_a = "a".charCodeAt(0);
const CC_Z = "Z".charCodeAt(0);
const CC_z = "z".charCodeAt(0);
const CC_WHITE_SPACE = " ".charCodeAt(0);
const CC_EOL = "\n".charCodeAt(0);

const NUM_LOWER_LIMIT = "0".charCodeAt(0) - 1;
const NUM_UPPER_LIMIT = "9".charCodeAt(0) + 1;

export class Tokenizer implements ITokenizer {

    private end: number;
    private pos: number = 0;

    constructor(private text: string) {
        this.end = text.length;
    }

    nextToken(): Token {
        var token = this.getToken();

        this.pos = token.end;
        console.log(this.pos);
        return token;
    }

    hasNext() {
        return this.pos < this.end;
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
            if (this.pos >= this.end)
                return new Token(this.pos, this.pos, TokenType.EOF, "EOF");

            let code = this.text.charCodeAt(this.pos);

            if (this.isIdentifierTokenStart(code))
                return this.readWord()

            switch (code) {
                case CC_WHITE_SPACE:
                case CC_EOL:
                    this.skipWhitespace();
                    break;
                default:
                    throw new Error(`Unknown charcode: ${code}`)
            }
        }

        return token;
    }

    skipWhitespace() {
        let currentPos = this.pos + 1;
        let charCode = this.text.charCodeAt(currentPos);
        while (charCode == CC_WHITE_SPACE ||
            charCode == CC_EOL) {
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
}