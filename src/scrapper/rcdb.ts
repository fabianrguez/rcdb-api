import type { RollerCoaster, Stats } from '@app/types';
import axiosInstance from '@scrapper/axiosInstance';
import type { Cheerio, CheerioAPI, Element } from 'cheerio';
import { load } from 'cheerio';
import { Presets, SingleBar } from 'cli-progress';

export type Regions = 'Madrid' | 'Europe' | 'Spain';

const camelize = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, '');

const REGION_COASTERS_MAPPER: { [key: string]: string } = {
  Madrid: 'ol=25959&ot=2',
  Europe: 'ol=25852&ot=2',
  Spain: 'ol=25940&ot=2',
};

export default class Rcdb {
  /**
   * Only that contains gotham: nc=Gotham&ot=2
   * Only spain roller coasters: ol=25940&ot=2
   * Only Europe roller coasters: ol=25852&ot=2
   * Only Madrid roller coasters: ol=25959&ot=2
   */
  private static _coastersUrl: string = '/r.htm?';
  private static readonly COASTERS_PER_PAGE: number = 24;
  private static _coasters: RollerCoaster[] = [];
  private static _progressBar: SingleBar = new SingleBar({}, Presets.shades_classic);

  private static _getPagination(html: any): { totalCoasters: number; totalPages: number } {
    const $ = load(html);

    const totalCoasters: number =
      parseInt($('.int').text()) || parseInt($('table.t-list tr:nth-child(2) td:nth-child(2)').text());

    const totalPages = Math.ceil(totalCoasters / this.COASTERS_PER_PAGE);

    return {
      totalCoasters,
      totalPages,
    };
  }

  private static _getCoasterStats($: CheerioAPI): Stats {
    return $('table.stat-tbl tr')
      .map((_: number, element: Element) => {
        const dataValue: Cheerio<Element> = $(element).find('td');

        const getValue = (value: Cheerio<Element>) => {
          if (value.children().length > 1) {
            return value
              .children()
              .map((_: number, element: Element) => element.children.map((child: any) => child.data))
              .get();
          } else {
            return value.text();
          }
        };

        return {
          key: camelize($(element).find('th').text()),
          value: getValue(dataValue),
        };
      })
      .get()
      .reduce((obj: { [key: string]: any }, item: { [key: string]: any }) => ({ ...obj, [item.key]: item.value }), {});
  }

  private static async _getCoasterDetails(link: string): Promise<RollerCoaster> {
    const getCoasterId = (link: string): number => Number(link?.match(/\d/g)?.join(''));
    const coasterDetailResponse = await axiosInstance.get(link);
    const $: CheerioAPI = load(coasterDetailResponse.data);

    const stateDate: Cheerio<any> = $('time[datetime]');
    const coasterStats: Stats = this._getCoasterStats($);

    return {
      id: getCoasterId(link),
      name: $('#feature h1').text(),
      parkName: $('#feature > div > a:nth-of-type(1)').text(),
      city: $('#feature > div > a:nth-of-type(2)').text(),
      state: $('#feature > div > a:nth-of-type(3)').text(),
      country: $('#feature > div > a:nth-of-type(4)').text(),
      link: link,
      status: {
        state: stateDate.prev().text(),
        date: stateDate.prop('datetime'),
      },
      make: $('#feature .scroll:nth-of-type(2) a:nth-of-type(1)').text(),
      model: $('#feature .scroll:nth-of-type(2) a:nth-of-type(2)').text(),
      type: $('#feature ul:nth-of-type(1) > li:nth-of-type(2) a:nth-of-type(1)').text(),
      design: $('#feature ul:nth-of-type(1) > li:nth-of-type(3) a:nth-of-type(1)').text(),
      stats: coasterStats,
    };
  }

  private static async _getCoastersByPage(page: number): Promise<RollerCoaster[]> {
    const pageResponse = await axiosInstance.get(`${this._coastersUrl}&page=${page}`).catch(() => ({ data: {} }));
    const $paginated = load(pageResponse.data);
    const rows = $paginated('.stdtbl.rer tbody tr');
    let coastersPage: RollerCoaster[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row$ = load(rows[i]);
      const link = row$('td:nth-of-type(2) a').attr('href');

      if (link) {
        this._progressBar.increment();
        const rollerCoaster: RollerCoaster = await this._getCoasterDetails(link);

        coastersPage = [...coastersPage, rollerCoaster];
      }
    }

    return coastersPage;
  }

  static async scrapeCoasters({ region }: { region: Regions }) {
    this._coastersUrl += REGION_COASTERS_MAPPER[region];
    const axiosResponse = await axiosInstance.get(this._coastersUrl);
    const { totalCoasters, totalPages } = this._getPagination(axiosResponse.data);
    console.log(`Scrapping ${region} coasters 🎢`);

    console.log(`Coasters: ${totalCoasters} Pages: ${totalPages}\n`);

    this._progressBar.start(totalCoasters, 0);

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const coastersByPage: RollerCoaster[] = await this._getCoastersByPage(currentPage);
      this._coasters = [...this._coasters, ...coastersByPage];
    }

    this._progressBar.stop();

    return this._coasters;
  }
}
