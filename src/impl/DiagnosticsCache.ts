import { IDiagnosticsCache } from "../ifaces/IErrorCache";
import { Token } from "../ifaces/ITokenizer";


export class DiagnosticsCache implements IDiagnosticsCache {
    raiseError(token: Token, message: string) {
    }
}