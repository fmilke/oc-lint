import { Token } from "./ITokenizer";

export interface IDiagnosticsCache {
    raiseError(token: Token, message: string): void;
}