import JsonDB from '@app/db';
import type { RollerCoaster } from '@app/types';
import { Service } from '@lib/decorators';

@Service()
export default class RollerCoasterService {
  private _db: JsonDB;

  constructor() {
    this._db = JsonDB.getInstance();
  }

  public async getAllCoasters(offset: number, limit: number): Promise<RollerCoaster[]> {
    const coasters: RollerCoaster[] = await this._db.readDBFile<RollerCoaster[]>('coasters');

    return coasters.splice(offset, limit);
  }
}
