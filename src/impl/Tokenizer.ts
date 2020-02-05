import { ITokenizer, Token } from "../ifaces/ITokenizer";

export class Tokenizer implements ITokenizer {
    nextToken(): Token {
        throw new Error("Method not implemented.");
    }
}