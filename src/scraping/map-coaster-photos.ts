import { Picture, RollerCoaster } from '@app/types';
import { __COASTERS_DB_FILENAME__, __COASTERS_RAW_DB_FILENAME__ } from '@app/constants';
import JsonDB from '@app/db';
import config from '@config';

function mapCoasterImagesToStaticPath(coasters: RollerCoaster[]): RollerCoaster[] {
  const getRcdbPath = (url: string) => `${config.RCDB_URL}${url}`;

  return coasters.map((coaster: RollerCoaster) => {
    const mainPicture: Picture = coaster.mainPicture
      ? { ...coaster.mainPicture, url: getRcdbPath(coaster.mainPicture.url) }
      : ({} as Picture);

    const coasterPhotos: Picture[] =
      coaster?.pictures?.map((picture: Picture) => ({ ...picture, url: getRcdbPath(picture.url) })) ?? [];

    return {
      ...coaster,
      mainPicture,
      pictures: coasterPhotos,
    };
  });
}

(async () => {
  const db = JsonDB.getInstance();
  const rawCoastersFile: RollerCoaster[] = await db.readDBFile<RollerCoaster[]>(__COASTERS_RAW_DB_FILENAME__);

  const coastersMapped: RollerCoaster[] = mapCoasterImagesToStaticPath(rawCoastersFile);

  db.writeDBFile<RollerCoaster[]>(__COASTERS_DB_FILENAME__, coastersMapped);

  console.log('All coasters 🎢 images have been mapped to static path.');
})();
