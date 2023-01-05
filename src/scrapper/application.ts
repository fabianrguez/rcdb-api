import { RollerCoasterService } from '@app/services';
import Rcdb from '@scrapper/rcdb';
import type { RollerCoaster } from '@app/types';

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
  private readonly _rollerCoasterService: RollerCoasterService;

  constructor() {
    console.log(`${title} ${version}`);
    this._rollerCoasterService = new RollerCoasterService();
  }

  async start() {
    const coasters: RollerCoaster[] = await Rcdb.scrapeCoasters();

    console.log('Saving coasters data to database');
    coasters.forEach((coaster: RollerCoaster) => this._rollerCoasterService.populateDBData(coaster));
    console.log('🚀 Coasters data saved!');
  }
}
