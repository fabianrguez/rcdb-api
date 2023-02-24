import { load } from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import Scraper from './scraper';
import { getNumberOnly } from '@app/utils';

export default class PaginatedScraper extends Scraper {
  protected readonly ITEMS_PER_PAGE: number = 24;

  protected getPagination(html: any): { total: number; pages: number } {
    const $ = load(html);

    const total: number =
      parseInt($('.int').text()) || parseInt($('table.t-list tr:nth-child(2) td:nth-child(2)').text());

    const pages = Math.ceil(total / this.ITEMS_PER_PAGE);

    return {
      total,
      pages,
    };
  }

  protected async scrapePages<TData = any>(
    url: string,
    onItemScrape: ($htmlPage: CheerioAPI, id: number) => TData
  ): Promise<TData[]> {
    const pageData = await this.fetchUrl(url);
    const { total, pages } = this.getPagination(pageData);
    let allItems: TData[] = [];

    console.log(`Items: ${total}, Pages: ${pages}`);

    for (let page = 1; page <= total; page++) {
      const itemsByPage = await this.__getDataByPage(url, page, onItemScrape);
      allItems = [...allItems, ...itemsByPage];
    }

    return allItems;
  }

  private async __getDataByPage<TData>(
    url: string,
    page: number,
    onItemScrape: ($htmlPage: CheerioAPI, id: number) => TData
  ): Promise<TData[]> {
    const data = await this.fetchUrl(`${url}&page=${page}`);
    const $paginated = load(data);
    const rows = $paginated('.stdtbl.rer tbody tr');
    let itemsPage: TData[] = [];

    for (let item = 0; item < rows.length; item++) {
      const $row = load(rows[item]);
      const link = $row('td:nth-of-type(2) a').attr('href');

      if (link) {
        const linkData = await this.fetchUrl(link);
        const $page: CheerioAPI = load(linkData);
        const linkItem = onItemScrape($page, getNumberOnly(link));

        itemsPage = [...itemsPage, linkItem];
      }
    }

    return itemsPage;
  }
}
