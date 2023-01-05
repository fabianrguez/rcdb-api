import { Service } from '@lib/decorators';
import DataBase from '@app/db';
import type { AllCoastersDB, RollerCoaster } from '@app/types';

@Service()
export default class RollerCoasterService {
  private _db: DataBase;

  constructor() {
    this._db = DataBase.getInstance();
  }

  public populateDBData(data: RollerCoaster): void {
    this._db.pushData<RollerCoaster>(`/coasters/${data.id}`, data);
  }

  public async getAllCoasters(): Promise<RollerCoaster[]> {
    const data: AllCoastersDB = await this._db.getData<AllCoastersDB>();
    const coastersData: RollerCoaster[] = Object.values(data.coasters).map((coaster: RollerCoaster) => coaster);

    return coastersData;
  }
}
