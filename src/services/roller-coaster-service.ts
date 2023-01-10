import { Service } from '@lib/decorators';
import DataBase from '@app/db';
import type { AllCoastersDB, RollerCoaster } from '@app/types';
import JsonDB from '@app/db';

@Service()
export default class RollerCoasterService {
  private _db: JsonDB;

  constructor() {
    this._db = JsonDB.getInstance();
  }

  public populateDBData(data: RollerCoaster): void {
    // this._db.pushData<RollerCoaster>(`/coasters/${data.id}`, data);
  }

  public async getAllCoasters(offset: number, limit: number): Promise<RollerCoaster[]> {
    return await this._db.readDBFile('coasters');
    //  return await this._db.getData<any>();

    // const coastersData: RollerCoaster[] = Object.values(data).map((coaster: RollerCoaster) => coaster);
  }
}
