import type { ControllerInfo } from '@lib/types';

export default class DiContainer {
  private static _instance: DiContainer;
  private _injectables!: any;
  private _controllers: ControllerInfo[] = [];

  private constructor() {}

  public setInjectable(key: string, provider: any): void {
    this._injectables = {
      ...this._injectables,
      [key]: provider,
    };
  }

  public setController(controller: any): void {
    this._controllers = [...this._controllers, controller];
  }

  public getInjectable(key: string): any {
    const injectable = this._injectables[key];

    if (!injectable) {
      throw new Error(`Not found ${key} injectable`);
    }

    return injectable;
  }

  public getControllers(): any {
    return this._controllers;
  }

  public static getInstance(): DiContainer {
    if (!this._instance) {
      this._instance = new DiContainer();
    }

    return this._instance;
  }
}
