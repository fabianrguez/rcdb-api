import type { Picture, RcdbPicture, RollerCoaster, Stats } from '@app/types';
import axiosInstance from '@scraping/axios-instance';
import type { Cheerio, CheerioAPI, Element } from 'cheerio';
import { load } from 'cheerio';
import { Presets, SingleBar } from 'cli-progress';
import { LOADIPHLPAPI } from 'dns';

export type Regions = 'Madrid' | 'Europe' | 'Spain' | 'World';

const camelize = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, '');

const REGION_COASTERS_MAPPER: { [key: string]: string } = {
  Madrid: 'ol=25959&ot=2',
  Europe: 'ol=25852&ot=2',
  Spain: 'ol=25940&ot=2',
  World: 'ot=2',
};

export default class RcdbScraper {
  private static _instance: RcdbScraper;
  private _coastersUrl: string = '/r.htm?';
  private readonly COASTERS_PER_PAGE: number = 24;
  private _coasters: RollerCoaster[] = [];
  private _progressBar: SingleBar = new SingleBar({}, Presets.shades_classic);
  private _photosByCoaster: { [coasterId: number]: Picture[] };

  private constructor() {}

  get photosByCoaster() {
    return this._photosByCoaster;
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new RcdbScraper();
    }

    return this._instance;
  }

  private _getPagination(html: any): { totalCoasters: number; totalPages: number } {
    const $ = load(html);

    const totalCoasters: number =
      parseInt($('.int').text()) || parseInt($('table.t-list tr:nth-child(2) td:nth-child(2)').text());

    const totalPages = Math.ceil(totalCoasters / this.COASTERS_PER_PAGE);

    return {
      totalCoasters,
      totalPages,
    };
  }

  private _getCoasterStats($: CheerioAPI): Stats {
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

  private _getPhotos($: CheerioAPI): Picture[] {
    const coasterPhotos: RcdbPicture[] = JSON.parse($('#pic_json').text()).pictures;

    return coasterPhotos.map((photo: RcdbPicture) => ({
      id: photo.id,
      name: photo.name,
      url: photo.url,
      copyName: photo.copy_name,
      copyDate: photo.copy_date,
    }));
  }

  private async _getCoasterDetails(link: string): Promise<RollerCoaster> {
    const getCoasterId = (link: string): number => Number(link?.match(/\d/g)?.join(''));

    try {
      const coasterDetailResponse = await axiosInstance.get(link);
      const $: CheerioAPI = load(coasterDetailResponse.data);

      const stateDate: Cheerio<any> = $('time[datetime]');
      const coasterStats: Stats = this._getCoasterStats($);
      const coasterPhotos: Picture[] = this._getPhotos($);
      const mainPictureId: number = Number($('#demo [aria-label=Picture]').prop('data-id'));

      this._photosByCoaster = { ...this._photosByCoaster, [getCoasterId(link)]: coasterPhotos };

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
        mainPicture: coasterPhotos.find((photo: Picture) => photo.id === mainPictureId),
        pictures: coasterPhotos,
      };
    } catch (error: any) {
      console.log(`💥 Error getting coaster ${getCoasterId(link)} info`, error);

      return {
        id: getCoasterId(link),
      } as RollerCoaster;
    }
  }

  private async _getCoastersByPage(page: number): Promise<RollerCoaster[]> {
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

  public async scrapeCoasters({ region }: { region: Regions }) {
    const start = performance.now();

    this._coastersUrl += REGION_COASTERS_MAPPER[region];

    const axiosResponse = await axiosInstance.get(this._coastersUrl);
    const { totalCoasters, totalPages } = this._getPagination(axiosResponse.data);
    console.log(`Scraping ${region} coasters 🎢`);

    console.log(`Coasters: ${totalCoasters} Pages: ${totalPages}\n`);

    this._progressBar.start(totalCoasters, 0);

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const coastersByPage: RollerCoaster[] = await this._getCoastersByPage(currentPage);
      this._coasters = [...this._coasters, ...coastersByPage];
    }

    const end = performance.now();
    const time = (end - start) / 1000 / 60;

    this._progressBar.stop();

    console.log(`Coasters scraped in ${time} minutes`);

    return this._coasters;
  }

  public async processCoasterPhotos(
    photosByCoaster: { [coasterId: string | number]: Picture[] } = this._photosByCoaster
  ) {
    console.log('processing coaster images...');
    // const photosByCoasterEntry = Object.entries(photosByCoaster);
    let processedPhotosByCoaster = {};

    for (const coasterPhotosEntry of Object.entries(photosByCoaster)) {
      const [coasterId, photos]: [string, Picture[]] = coasterPhotosEntry;
      console.log(`Coaster ${coasterId}`);

      const processedPhotos = await Promise.allSettled(
        photos.map(async (photo: Picture) => {
          console.log(`process photo ${photo.url}`);
          
          const { data: pictureBuffer } = await axiosInstance(photo.url, { responseType: 'arraybuffer' }).catch(() => {
            console.log(`💥 Error getting photo ${photo.url}`);

            return {
              data: null,
            };
          });

          return { ...photo, pictureBuffer };
        })
      );

      // for (const photo of photos) {
      //   console.log(`processing photo ${photo.url} of coaster ${coasterId}`);

      //   const { data: pictureBuffer } = await axiosInstance(photo.url, { responseType: 'arraybuffer' }).catch(() => {
      //     console.log(`💥 Error getting photo ${photo.url}`);

      //     return {
      //       data: null,
      //     };
      //   });

      //   processedPhotos.push(pictureBuffer);
      // }

      processedPhotosByCoaster = {
        ...processedPhotosByCoaster,
        [coasterId]: processedPhotos,
      };
    }

    return processedPhotosByCoaster;

    // return await Promise.allSettled(
    //   photosByCoasterEntry.map(async ([coasterId, photos]: [string, Picture[]]) => {
    //     const processedCoasterPhotos = await Promise.allSettled(
    //       photos.map(async (photo: Picture) => {
    //         try {
    //           console.log(`picture ${photo.url}`);

    //           const { data: pictureBuffer } = await axiosInstance(photo.url, { responseType: 'arraybuffer' });

    //           return { ...photo, pictureBuffer };
    //         } catch (e: any) {
    //           console.log(`💥 Error fetching image for ${photo.url}`);
    //           return { ...photo, pictureBuffer: null };
    //         }
    //       })
    //     );

    //     return {
    //       [coasterId]: processedCoasterPhotos,
    //     };
    //   })
    // );
  }
}
