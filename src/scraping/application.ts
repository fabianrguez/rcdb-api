import { __COASTERS_DB_FILENAME__, __COASTERS_RAW_DB_FILENAME__, __PHOTOS_BY_COASTER_DB_FILENAME__} from '@app/constants';
import JsonDB from '@app/db';
import type { Picture, RollerCoaster } from '@app/types';
import type { Regions } from '@scraping/rcdb-scraper';
import RcdbScraper from '@scraping/rcdb-scraper';
import StaticFiles from 'db/static-files';

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
  private _rcdbScraper: RcdbScraper;
  private _staticFiles: StaticFiles;

  constructor() {
    console.log(`${title} ${version}`);
    this._jsonDb = JsonDB.getInstance();
    this._rcdbScraper = RcdbScraper.getInstance();
    this._staticFiles = StaticFiles.getInstance();
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

  public async _storeRollerCoastersPhotos(photosByCoaster: any[]) {
    console.log('💾 Storing photos by coasters');

    photosByCoaster.forEach(async (coaster: any) => {
      const [coasterId, photos]: any = Object.entries(coaster).flat();

      await Promise.all(
        photos.map(
          async (photo: any) =>
            await this._staticFiles
              .storeCoasterImage(photo.id, coasterId, photo.pictureBuffer)
              .catch(() => console.log(`💥 Error storing coaster ${coasterId} image to static`))
        )
      );
    });
  }

  private _mapCoasterImagesToStaticPath(coasters: RollerCoaster[]): RollerCoaster[] {
    const getStaticPath = (photoId: number, coasterId: number) => `/images/coasters/${coasterId}/${photoId}.webp`;

    return coasters.map((coaster: RollerCoaster) => {
      const mainPicture: Picture = coaster.mainPicture
        ? { ...coaster.mainPicture, url: getStaticPath(coaster.mainPicture.id, coaster.id) }
        : ({} as Picture);

      const coasterPhotos: Picture[] =
        coaster?.pictures.map((picture: Picture) => ({ ...picture, url: getStaticPath(picture.id, coaster.id) })) ?? [];

      return {
        ...coaster,
        mainPicture,
        pictures: coasterPhotos,
      };
    });
  }

  private async _savePhotosByCoaster(photosByCoaster: { [coasterId: string]: Picture[] }): Promise<void> {
    console.log('💾 saving photos by coaster to db file');

    return await this._jsonDb.writeDBFile(__PHOTOS_BY_COASTER_DB_FILENAME__, photosByCoaster);
  }

  async start({ region, saveData }: { region: Regions; saveData: boolean }) {
    const coasters: RollerCoaster[] = await this._rcdbScraper.scrapeCoasters({ region });

    await this._savePhotosByCoaster(this._rcdbScraper.photosByCoaster);
    await this._saveRawRollerCoasters(coasters);

    if (saveData) {
      const coastersMapped: RollerCoaster[] = this._mapCoasterImagesToStaticPath(coasters);
      await this._saveRollerCoasters(coastersMapped);
    }
  }
}
