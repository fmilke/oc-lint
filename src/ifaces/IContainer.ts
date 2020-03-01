import { IService } from "./IService";

export enum InjectionScope {
    Transient,
    Singleton,
}

export interface IContainer {
    register(serviceName: string, serviceClass: IService, scope: InjectionScope): void;
    resolve<T>(serviceName: string): T;
}