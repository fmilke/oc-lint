import { IDiagnosticsCache } from "../ifaces/IErrorCache";
import { Token } from "../ifaces/ITokenizer";


export class DiagnosticsCache implements IDiagnosticsCache {
    errors: { token: Token, message: string }[] = [];

    raiseError(token: Token, message: string) {
        this.errors.push({ token, message });
    }
}