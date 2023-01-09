import { JsonDB, Config } from 'node-json-db';

export default class DataBase {
  private readonly _name: string = 'rollerCoasterDB';
  private static _instance: DataBase;
  private _db: JsonDB;

  private constructor() {
    this._db = new JsonDB(new Config(this._name, true, false, '/'));
  }

  static getInstance(): DataBase {
    if (!this._instance) {
      this._instance = new DataBase();
    }

    return this._instance;
  }

  public pushData<T>(key: string, data: T) {
    this._db.push(key, data, true);
  }

  public async getData<T>(): Promise<T> {
    return await this._db.getData('/');
  }
}
