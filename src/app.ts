import { Container } from "./impl/Container";
import { ASTStack } from "./impl/ASTBuilder";
import { InjectionScope } from "./ifaces/IContainer";
import { DiagnosticsCache } from "./impl/DiagnosticsCache";

export const appContainer = new Container();

appContainer.register("ASTStack", () => new ASTStack(), InjectionScope.Transient);
appContainer.register("DiagnosticsCache", () => new DiagnosticsCache(), InjectionScope.Singleton);