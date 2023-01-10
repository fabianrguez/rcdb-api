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

  public async getAllCoasters(offset: number, limit: number): Promise<RollerCoaster[]> {
    const data: any[] = await this._db.getData<any>();

    // const coastersData: RollerCoaster[] = Object.values(data).map((coaster: RollerCoaster) => coaster);

    return data;
  }
}
