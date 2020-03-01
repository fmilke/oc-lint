import { IContainer, InjectionScope } from "../ifaces/IContainer";
import { IService } from "../ifaces/IService";

interface ServiceConfig {
    class: () => IService,
    scope: InjectionScope,
}

export class Container implements IContainer {

    services = new Map<string, ServiceConfig>();
    singletons = new Map<string, IService>();

    register(
        serviceName: string,
        serviceClass: () => IService,
        scope: InjectionScope = InjectionScope.Singleton
    ): void {
        if (this.services.has(serviceName))
            throw new Error(`Failed registering service. Service for ${serviceName} is already registered.`);

        this.services.set(serviceName, {
            class: serviceClass,
            scope,
        });
    }

    resolve<T>(serviceName: string): T {
        const config = this.services.get(serviceName);

        if (!config)
            throw new Error(`Failed resolving service. No service is for ${serviceName} registered`);

        let instance;

        if (config.scope = InjectionScope.Transient) {
            instance = config.class();
        }
        else {
            instance = this.singletons.get(serviceName);
            if (!instance) {
                instance = config.class();
                this.singletons.set(serviceName, instance);
            }
        }

        return instance as T;
    }


}