import { __COASTERS_DB_FILENAME__, __COASTERS_RAW_DB_FILENAME__ } from '@app/constants';
import JsonDB from '@app/db';
import type { RollerCoaster } from '@app/types';
import type { Regions } from '@scraping/rcdb-application';
import RcdbScraper from '@scraping/rcdb-application';

export const title = `
╔═══╦═══╦═══╦══╗─╔═══╗
║╔═╗║╔═╗╠╗╔╗║╔╗║─║╔═╗║
║╚═╝║║─╚╝║║║║╚╝╚╗║╚══╦══╦═╦══╦══╦══╗
║╔╗╔╣║─╔╗║║║║╔═╗║╚══╗║╔═╣╔╣╔╗║╔╗║║═╣
║║║╚╣╚═╝╠╝╚╝║╚═╝║║╚═╝║╚═╣║║╔╗║╚╝║║═╣
╚╝╚═╩═══╩═══╩═══╝╚═══╩══╩╝╚╝╚╣╔═╩══╝
─────────────────────────────║║
─────────────────────────────╚╝`;

const version = 'v0.0.1';

export default class Application {
  private _jsonDb: JsonDB;
  private _rcdbScraper: RcdbScraper;

  constructor() {
    console.log(`${title} ${version}`);
    this._jsonDb = JsonDB.getInstance();
    this._rcdbScraper = RcdbScraper.getInstance();
  }

  private async _saveRollerCoasters(coasters: RollerCoaster[]): Promise<void> {
    console.log('💾 Saving coasters data to database');
    await this._jsonDb
      .writeDBFile<RollerCoaster[]>(__COASTERS_DB_FILENAME__, coasters)
      .then(() => {
        console.log('🎢 Coasters data saved!');
      })
      .catch((err: Error) => console.error('💥 Error creating coasters database file...', err));
  }

  private async _saveRawRollerCoasters(coasters: RollerCoaster[]): Promise<void> {
    console.log('💾 Saving raw coasters data to database');
    await this._jsonDb
      .writeDBFile<RollerCoaster[]>(`${__COASTERS_RAW_DB_FILENAME__}`, coasters)
      .then(() => {
        console.log('🎢 Coasters data saved!');
      })
      .catch((err: Error) => console.error('💥 Error creating raw coasters database file...', err));
  }

  async start({ region, saveData }: { region: Regions; saveData: boolean }) {
    const coasters: RollerCoaster[] = await this._rcdbScraper.scrapeCoasters({ region });

    await this._saveRawRollerCoasters(coasters);

    if (saveData) {
      await this._saveRollerCoasters(coasters);
    }
  }
}
