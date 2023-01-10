import { MetadataKeys } from '@lib/types';
import type { Methods, Route } from '@lib/types';

export default function methodDecoratorFactory(method: Methods) {
  return (path: string = ''): MethodDecorator => {
    return (target, propertyKey) => {
      const controllerClass = target.constructor;
      const routers: Route[] = Reflect.hasMetadata(MetadataKeys.ROUTES, controllerClass)
        ? Reflect.getMetadata(MetadataKeys.ROUTES, controllerClass)
        : [];
      routers.push({
        method,
        path,
        handlerName: propertyKey,
      });
      Reflect.defineMetadata(MetadataKeys.ROUTES, routers, controllerClass);
    };
  };
}
