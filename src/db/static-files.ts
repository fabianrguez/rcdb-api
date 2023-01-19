import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export default class StaticFiles {
  private readonly __STATICS_PATH__ = './static';
  private readonly __IMAGE_EXTENSION__ = 'webp';
  private static _instance: StaticFiles;

  private constructor() {}

  public static getInstance(): StaticFiles {
    if (!this._instance) {
      this._instance = new StaticFiles();
    }

    return this._instance;
  }

  public async storeCoasterImage(name: string, coasterId: string | number, imageBuffer: ArrayBuffer) {
    const coasterPath = `${this.__STATICS_PATH__}/images/coasters/${coasterId}`;

    if (!existsSync(coasterPath)) {
      await mkdir(coasterPath, { recursive: true });
    }
    return await writeFile(
      `${this.__STATICS_PATH__}/images/coasters/${coasterId}/${name}.${this.__IMAGE_EXTENSION__}`,
      Buffer.from(imageBuffer)
    );
  }
}
