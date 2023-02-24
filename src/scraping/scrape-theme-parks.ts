import RcdbScraper from '@scraping/rcdb-scraper';
import { title } from './application';
import type ThemePark from 'types/theme-park';
import JsonDB from '@app/db';

const rcdbScraper: RcdbScraper = RcdbScraper.getInstance();
const jsonDB: JsonDB = JsonDB.getInstance();

async function saveThemeParks(themeParks: ThemePark[]): Promise<void> {
  console.log('🎢 Saving theme parks to DB!');

  await jsonDB.writeDBFile<ThemePark[]>('theme-parks', themeParks);
}

(async () => {
  console.log(title);
  console.log(`v${process.env.npm_package_version}`);

  const themeParks: ThemePark[] = await rcdbScraper.scrapeThemeParks();

  await saveThemeParks(themeParks);
})();
