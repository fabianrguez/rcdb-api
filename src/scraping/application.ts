import { RollerCoasterService } from '@app/services';
import type { RollerCoaster } from '@app/types';
import type { Regions } from '@scraping/rcdb';
import Rcdb from '@scraping/rcdb';
import JsonDB from '@app/db';

const title = `
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
  // private readonly _rollerCoasterService: RollerCoasterService;

  constructor() {
    console.log(`${title} ${version}`);
    this._jsonDb = JsonDB.getInstance();
    // this._rollerCoasterService = new RollerCoasterService();
  }

  async start(region: Regions) {
    const coasters: RollerCoaster[] = await Rcdb.scrapeCoasters({ region });

    console.log('Saving coasters data to database');
    await this._jsonDb
      .writeDBFile<RollerCoaster[]>('coasters', coasters)
      .then(() => {
        console.log('🎢 Coasters data saved!');
      })
      .catch((err: Error) => console.error('‼️ Error creating coasters database file...', err));
    // coasters.forEach((coaster: RollerCoaster) => this._rollerCoasterService.populateDBData(coaster));
  }
}
