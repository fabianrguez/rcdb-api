export default function Inject(): PropertyDecorator {
  return function (target, propertyKey) {
    const containerClass = target.constructor;
    const PropertyType = Reflect.getMetadata('design:type', target, propertyKey);
    const injectedTypes = Reflect.getMetadata('dependencies-keys-property', target) ?? [];
    const data: any = {
      propertyKey,
      propertyType: PropertyType.name,
    };

    if (PropertyType.name) {
      Reflect.defineMetadata('dependencies-keys-property', [...injectedTypes, data], containerClass);
    }
  };
}
