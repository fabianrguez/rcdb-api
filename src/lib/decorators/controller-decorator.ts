import { MetadataKeys } from '@lib/types';

export default function Controller(basePath: string = '/'): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath, target);
  };
}