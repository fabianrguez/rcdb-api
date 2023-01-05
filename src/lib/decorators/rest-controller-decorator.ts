import { DiContainer } from '@lib/core';
import type { ControllerInfo } from '@lib/types';

export default function RestController(basePath: string): Function {
  return (target: { new (): any }): void => {
    console.log('rest controller decorator');
    const injectionContainer = DiContainer.getInstance();

    const test = target as any;

    const controllerInfo: ControllerInfo = {
      name: target.name,
      basePath,
      controllerClass: target,
      instance: new test(),
    };

    injectionContainer.setController(controllerInfo);
  };
}
