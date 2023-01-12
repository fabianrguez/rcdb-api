import JsonDB from '@app/db';
import type { RollerCoaster } from '@app/types';
import { PaginatedResponse } from '@app/models';
import { Service } from '@lib/decorators';

@Service()
export default class RollerCoasterService {
  private readonly __COASTER_DB_FILE__: string = 'coasters';
  private _db: JsonDB;

  constructor() {
    this._db = JsonDB.getInstance();
  }

  private async getCoastersDB(): Promise<RollerCoaster[]> {
    return await this._db.readDBFile<RollerCoaster[]>(this.__COASTER_DB_FILE__);
  }

  public async getPaginatedCoasters(offset: number, limit: number): Promise<PaginatedResponse<RollerCoaster>> {
    const coasters: RollerCoaster[] = await this.getCoastersDB();
    const paginatedResponse = new PaginatedResponse<RollerCoaster>(coasters, offset, limit);

    return paginatedResponse;
  }

  public async getCoasterById(id: number): Promise<RollerCoaster | undefined> {
    const coasters: RollerCoaster[] = await this.getCoastersDB();

    return coasters.find(({ id: coasterId }: RollerCoaster) => coasterId === id);
  }
}
