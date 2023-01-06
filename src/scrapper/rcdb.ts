import { load } from 'cheerio';
import axiosInstance from '@scrapper/axiosInstance';
import type { RollerCoaster } from '@app/types';

const waaait = async (timeMs: number) => new Promise((resolve) => setTimeout(resolve, timeMs));

export default class Rcdb {
  /**
   * Only that contains gotham: nc=Gotham&ot=2
   * Only spain roller coasters: ol=25940&ot=2
   * Only Europe roller coasters: ol=25852&ot=2
   */
  private static readonly COASTERS_TYPE: string = '/r.htm?ol=25852&ot=2';
  private static readonly COASTERS_PER_PAGE: number = 24;
  private static _coasters: RollerCoaster[] = [];

  private static _getPagination(html: any): { totalCoasters: number; totalPages: number } {
    const $ = load(html);

    const totalCoasters = parseInt($('.int').text());
    const totalPages = Math.ceil(totalCoasters / this.COASTERS_PER_PAGE);

    return {
      totalCoasters,
      totalPages,
    };
  }

  private static async _getCoasterDetails(link: string): Promise<RollerCoaster> {
    const getCoasterId = (link: string): number => Number(link?.match(/\d/g)?.join(''));
    const coasterDetailResponse = await axiosInstance.get(link);
    const $ = load(coasterDetailResponse.data);

    return {
      id: getCoasterId(link),
      name: $('#feature h1').text(),
      parkName: $('#feature > div > a:nth-of-type(1)').text(),
      city: $('#feature > div > a:nth-of-type(2)').text(),
      state: $('#feature > div > a:nth-of-type(3)').text(),
      country: $('#feature > div > a:nth-of-type(4)').text(),
      link: link,
      make: $('#feature .scroll:nth-of-type(2) a:nth-of-type(1)').text(),
      model: $('#feature .scroll:nth-of-type(2) a:nth-of-type(2)').text(),
      type: $('#feature ul:nth-of-type(1) > li:nth-of-type(2) a:nth-of-type(1)').text(),
      design: $('#feature ul:nth-of-type(1) > li:nth-of-type(3) a:nth-of-type(1)').text(),
      length: '',
      height: '',
      speed: '',
      inversions: '',
      verticalAngle: '',
      duration: '',
      'g-Force': '',
      drop: '',
    };
  }

  private static async _getCoastersByPage(page: number): Promise<RollerCoaster[]> {
    const pageResponse = await axiosInstance.get(`${this.COASTERS_TYPE}&page=${page}`).catch(() => ({ data: {} }));
    const $paginated = load(pageResponse.data);
    const rows = $paginated('.stdtbl.rer tbody tr');
    let coastersPage: RollerCoaster[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row$ = load(rows[i]);
      const link = row$('td:nth-of-type(2) a').attr('href');

      if (link) {
        const rollerCoaster: RollerCoaster = await this._getCoasterDetails(link);

        coastersPage = [...coastersPage, rollerCoaster];

        await waaait(1000);
      }
    }

    return coastersPage;
  }

  static async scrapeCoasters() {
    const axiosResponse = await axiosInstance.get(this.COASTERS_TYPE);
    const { totalCoasters, totalPages } = this._getPagination(axiosResponse.data);
    console.log(`Coasters: ${totalCoasters} Pages: ${totalPages}`);

    for (let currentPage = 1; currentPage < totalPages; currentPage++) {
      console.log(`Page ${currentPage} of ${totalPages}`);
      const coastersByPage: RollerCoaster[] = await this._getCoastersByPage(currentPage);
      this._coasters = [...this._coasters, ...coastersByPage];
    }

    return this._coasters;
  }
}
