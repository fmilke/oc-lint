import { ITokenizer, Token } from "../ifaces/ITokenizer";
import { DocumentString } from "../DocumentString";

export class Tokenizer implements ITokenizer {

    private end: number;
    private pos: number = 0;

    constructor(private documentString: DocumentString) {
        this.end = documentString.text.length;
    }

    nextToken(): Token {
        throw new Error("Method not implemented.");
    }

    hasNext() {
        return this.pos < this.end;
    }

    *[Symbol.iterator](): Iterator<Token, void> {
        if (this.hasNext())
            yield this.nextToken();
    }
}