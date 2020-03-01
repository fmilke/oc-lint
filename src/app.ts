import { Container } from "./impl/Container";
import { ASTStack } from "./impl/ASTBuilder";
import { InjectionScope } from "./ifaces/IContainer";

export const appContainer = new Container();

appContainer.register("ASTStack", () => new ASTStack(), InjectionScope.Transient);