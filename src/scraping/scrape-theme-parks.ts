import RcdbScraper from '@scraping/rcdb-application';
import { title } from './application';
import type ThemePark from 'types/theme-park';
import JsonDB from '@app/db';
import { __THEME_PARKS_DB_FILENAME__ } from 'constants/database';

const rcdbScraper: RcdbScraper = RcdbScraper.getInstance();
const jsonDB: JsonDB = JsonDB.getInstance();

async function saveThemeParks(themeParks: ThemePark[]): Promise<void> {
  console.log('🎢 Saving theme parks to DB!');

  await jsonDB.writeDBFile<ThemePark[]>(__THEME_PARKS_DB_FILENAME__, themeParks);
}

(async () => {
  console.log(title);
  console.log(`v${process.env.npm_package_version}`);

  const themeParks: ThemePark[] = await rcdbScraper.scrapeThemeParks();

  // await saveThemeParks(themeParks);
})();
