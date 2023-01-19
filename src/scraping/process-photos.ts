import { __PHOTOS_BY_COASTER_DB_FILENAME__, __PROCESSED_COASTERS_PHOTOS_DB_FILENAME__ } from '@app/constants';
import JsonDB from '@app/db';
import type { Picture } from '@app/types';
import StaticFiles from 'db/static-files';
import axiostInstance from './axios-instance';

const db = JsonDB.getInstance();

(async () => {
  const staticFiles = StaticFiles.getInstance();

  await db.createDBFile(__PROCESSED_COASTERS_PHOTOS_DB_FILENAME__, {});

  const photosByPicturesDB: { [coasterId: string]: Picture[] } = await db.readDBFile<{
    [coasterId: string]: Picture[];
  }>(__PHOTOS_BY_COASTER_DB_FILENAME__);
  const photosMapped: { coasterId: string; photos: Picture[] }[] = Object.entries(photosByPicturesDB)
    .map(([coasterId, photos]: [string, Picture[]]) => ({ photos, coasterId }))
    .filter((item) => item.photos.length > 0);

  for (const { coasterId, photos } of photosMapped) {
    console.log(`🎢 Coaster ${coasterId}`);

    await Promise.allSettled(
      photos.map(async (photo: Picture) => {
        console.log(`photo ${photo.url}`);

        const { data: pictureBuffer } = await axiostInstance.get(photo.url).catch(() => ({ data: null }));

        await staticFiles.storeCoasterImage(String(photo.id), coasterId, pictureBuffer);
        await db.pushKeyObjectToDB(__PROCESSED_COASTERS_PHOTOS_DB_FILENAME__, { [coasterId]: { ...photo } });

        return { ...photo, pictureBuffer };
      })
    );
  }
})();
