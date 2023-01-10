import config from '@config';
import mongoose, { Schema } from 'mongoose';
import { JsonDB } from 'node-json-db';

export const CoasterSchema = new Schema({
  id: Number,
  name: String,
  parkName: String,
  city: String,
  state: String,
  status: {
    state: String,
    date: String,
  },
  country: String,
  link: String,
  make: String,
  model: String,
  type: String,
  design: String,
  stats: {
    length: String,
    height: String,
    speed: String,
    inversions: String,
    duration: String,
    arrangement: String,
    capacity: String,
    dimensions: Array || String,
    designer: String,
    verticalAngle: String,
    gForce: String,
    drop: String,
    cost: String,
    builtBy: String,
    elements: Array || String,
    formerNames: Array || String,
  },
});

export default class DataBase {
  private readonly _name: string = 'rollerCoasterDB';
  private static _instance: DataBase;
  private _db: JsonDB;
  private _coasterModel: mongoose.Model<any>;

  private constructor() {
    mongoose.set('strictQuery', true);

    // this._db = new JsonDB(new Config(this._name, true, false, '/'));
    this.initDB();
  }

  private async initDB() {
    await mongoose
      .connect(String(config.MONGODB_URI))
      .then(() => {
        console.log('⚡[database] connected to database');
        this._coasterModel = mongoose.model('coaster', CoasterSchema);
      })
      .catch((error: Error) => console.error(error));
  }

  static getInstance(): DataBase {
    if (!this._instance) {
      this._instance = new DataBase();
    }

    return this._instance;
  }

  public async pushData<T>(key: string, data: T) {
    const _data = new this._coasterModel(data);

    await _data.save();
    // this._db.push(key, data, true);
  }

  public async getData<T>(): Promise<T> {
    return this._coasterModel.find() as T;
    // return await this._db.getData('/');
  }

  public async close(): Promise<void> {
    await mongoose.disconnect();
  }
}
