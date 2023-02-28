import { __COASTERS_DB_FILENAME__ } from '@app/constants';
import JsonDB from '@app/db';
import { PaginatedResponse } from '@app/models';
import type { RollerCoaster } from '@app/types';
import { getRandom } from '@app/utils';
import { Service } from '@lib/decorators';

@Service()
export default class RollerCoasterService {
  private _db: JsonDB;

  constructor() {
    this._db = JsonDB.getInstance();
  }

  private async _getCoastersDB(): Promise<RollerCoaster[]> {
    return await this._db.readDBFile<RollerCoaster[]>(__COASTERS_DB_FILENAME__);
  }

  public async getPaginatedCoasters(offset: number, limit: number): Promise<PaginatedResponse<RollerCoaster>> {
    const coasters: RollerCoaster[] = await this._getCoastersDB();
    const paginatedResponse = new PaginatedResponse<RollerCoaster>(coasters, offset, limit);

    return paginatedResponse;
  }

  public async getCoasterById(id: number): Promise<RollerCoaster | undefined> {
    const coasters: RollerCoaster[] = await this._getCoastersDB();

    return coasters.find(({ id: coasterId }: RollerCoaster) => coasterId === id);
  }

  public async getRandomCoaster(): Promise<RollerCoaster> {
    const coasters: RollerCoaster[] = await this._getCoastersDB();
    const randomIndex: number = getRandom(0, coasters.length);

    return coasters[randomIndex];
  }

  public async searchCoasters(searchTerm: string): Promise<RollerCoaster[]> {
    const coasters: RollerCoaster[] = await this._getCoastersDB();

    return coasters.filter(
      ({ name, park }: RollerCoaster) =>
        park.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        name?.toLowerCase()?.includes(searchTerm?.toLowerCase().toLowerCase())
    );
  }
}
