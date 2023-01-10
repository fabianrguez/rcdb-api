import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export default class JsonDB {
  private static _instance: JsonDB;
  private readonly __DB_PATH__: string = path.join(process.cwd(), './db');

  private constructor() {}

  public static getInstance(): JsonDB {
    if (!this._instance) {
      this._instance = new JsonDB();
    }

    return this._instance;
  }

  public async writeDBFile<T>(dbName: string, data: T) {
    return await writeFile(`${this.__DB_PATH__}/${dbName}.json`, JSON.stringify(data, null, 2), {
      encoding: 'utf-8',
    });
  }

  public async readDBFile<T>(dbName: string): Promise<T> {
    return await readFile(`${this.__DB_PATH__}/${dbName}.json`, 'utf-8').then(JSON.parse);
  }
}
