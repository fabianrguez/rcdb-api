import type {ParkCoaster, Picture, RcdbPicture, RollerCoaster, SocialMedia, Stats, ThemePark} from '@app/types';
import {getNumberOnly} from '@app/utils';
import axiosInstance from '@scraping/axios-instance';
import type {Cheerio, CheerioAPI, Element} from 'cheerio';
import {load} from 'cheerio';
import {Presets, SingleBar} from 'cli-progress';
import PaginatedScraper from './paginated-scraper';

export type Regions = 'Madrid' | 'Europe' | 'Spain' | 'World';

const DATE_TYPE_BY_INDEX = ["opened", "closed"]

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

const SOCIAL_MEDIA_MAPPER: { [key: string]: string } = {
  27: 'website',
  24: 'facebook',
  25: 'twitter',
  26: 'youtube',
  29: 'instagram',
  33: 'pinterest',
};

export default class RcdbScraper extends PaginatedScraper {
  private static _instance: RcdbScraper;
  private _coastersUrl: string = '/r.htm?';
  private _themParksUrl: string = '/r.htm?ot=3';
  private _coasters: RollerCoaster[] = [];
  private _progressBar: SingleBar = new SingleBar({}, Presets.shades_classic);
  private _photosByCoaster: { [coasterId: number]: Picture[] };

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new RcdbScraper();
    }

    return this._instance;
  }

  private _getCoasterStats($: CheerioAPI): Stats {
    return <Stats>$('table.stat-tbl tr')
      .map((_: number, element: Element) => {
        const dataValue: Cheerio<Element> = $(element).find('td');

        const getValue = (value: Cheerio<Element>) => {
          const values = value.map((i, td) =>
            ($(td).contents().first().text())
          ).toArray().map((element) => element.toString())


          return values.length > 1 ? values : values[0]
        };

        return {
          key: camelize($(element).find('th').text()),
          value: getValue(dataValue),
        };
      })
      .get()
      .reduce((obj: { [key: string]: any }, item: { [key: string]: any }) => ({...obj, [item.key]: item.value}), {});
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

  private _getMapCoords($: CheerioAPI): { lat: string; lng: string } {
    const mapLink: string = $('.map-tpl a[href^="https://www.google.com/maps/place"]').attr('href') + '';
    const splitMapLink: string[] = mapLink.split('/');
    const placeIndex = splitMapLink.indexOf('place');
    const coords = splitMapLink[placeIndex + 1];

    return {
      lat: coords.split(',')[0],
      lng: coords.split(',')[1],
    };
  }

  private async _getCoasterDetails(link: string): Promise<RollerCoaster> {
    try {
      const coasterDetailResponse = await axiosInstance.get(link);
      const $: CheerioAPI = load(coasterDetailResponse.data);

      const stateDate: Cheerio<any> = $('#feature time[datetime]');
      const coasterStats: Stats = this._getCoasterStats($);
      const coasterPhotos: Picture[] = this._getPhotos($);
      const mainPictureId: number = Number($('#demo [aria-label=Picture]').prop('data-id'));
      const mapLink: string = $('.map-tpl a[href^="https://www.google.com/maps/place"]').attr('href') + '';
      const splitMapLink: string[] = mapLink.split('/');
      const placeIndex = splitMapLink.indexOf('place');
      const coords = splitMapLink[placeIndex + 1];

      const operationDates = stateDate
        .map((_, el) => $(el).prop("datetime"))
        .toArray()
        .reduce((acc, element, currentIndex) => ({
            ...acc, [DATE_TYPE_BY_INDEX[currentIndex]]: element
          }),
          { opened: ""}
        );

      this._photosByCoaster = {...this._photosByCoaster, [getNumberOnly(link)]: coasterPhotos};

      return {
        id: getNumberOnly(link),
        name: $('#feature h1').text(),
        park: {
          name: $('#feature > div > a:nth-of-type(1)').text(),
          id: getNumberOnly($('#feature > div > a:nth-of-type(1)').prop('href') + ''),
        },
        city: $('#feature > div > a:nth-of-type(2)').text(),
        state: $('#feature > div > a:nth-of-type(3)').text(),
        country: $('#feature > div > a:nth-of-type(4)').text(),
        region: $('#feature > div > a:last-of-type').text(),
        link: link,
        status: {
          state: stateDate.prev().text(),
          date: operationDates
        },
        make: $('#feature .scroll:nth-of-type(2) a:nth-of-type(1)').text(),
        model: $('#feature .scroll:nth-of-type(2) a:nth-of-type(2)').text(),
        type: $('#feature ul:nth-of-type(1) > li:nth-of-type(2) a:nth-of-type(1)').text(),
        design: $('#feature ul:nth-of-type(1) > li:nth-of-type(3) a:nth-of-type(1)').text(),
        stats: coasterStats,
        mainPicture: coasterPhotos.find((photo: Picture) => photo.id === mainPictureId),
        pictures: coasterPhotos,
        coords: {
          lat: coords.split(',')[0],
          lng: coords.split(',')[1],
        },
      };
    } catch (error: any) {
      console.log(`💥 Error getting coaster ${getNumberOnly(link)} info`, error);

      return {
        id: getNumberOnly(link),
      } as RollerCoaster;
    }
  }

  private async _getDataByPage(page: number): Promise<RollerCoaster[]> {
    const pageResponse = await axiosInstance.get(`${this._coastersUrl}&page=${page}`).catch(() => ({data: {}}));
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

  public async scrapeCoasters({region}: { region: Regions }) {
    const start = performance.now();

    this._coastersUrl += REGION_COASTERS_MAPPER[region];

    const axiosResponse = await axiosInstance.get(this._coastersUrl);
    const {total: totalCoasters, pages: totalPages} = this.getPagination(axiosResponse.data);
    console.log(`Scraping ${region} coasters 🎢`);

    console.log(`Coasters: ${totalCoasters} Pages: ${totalPages}\n`);

    this._progressBar.start(totalCoasters, 0);

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const coastersByPage: RollerCoaster[] = await this._getDataByPage(currentPage);
      this._coasters = [...this._coasters, ...coastersByPage];
    }

    const end = performance.now();
    const time = (end - start) / 1000 / 60;

    this._progressBar.stop();

    console.log(`Coasters scraped in ${time} minutes`);

    return this._coasters;
  }

  public async scrapeThemeParks(): Promise<ThemePark[]> {
    console.log(`Scraping theme parks 🎢`);
    let themeParks: ThemePark[] = [];

    const onParkScrape = ($: CheerioAPI, id: number): ThemePark => {
      const statusDate: Cheerio<any> = $('#feature time[datetime]');
      const parkPhotos: Picture[] = this.getPhotos($);
      const mainPictureId: number = Number($('#demo [aria-label=Picture]').prop('data-id'));
      const $socialMedia = $('#media_row > a');
      const mapCoords = this._getMapCoords($);
      const $coasters = $('.stdtbl.ctr');

      const parkCoasters: ParkCoaster[] = $coasters
        .toArray()
        .map(($coasterTable: Element) => {
          const $tableHtml: CheerioAPI = load($coasterTable.children);
          const $coastersRows = $tableHtml('tbody tr');
          const status = $tableHtml('thead th:last-of-type').text().toLowerCase();

          return $coastersRows.toArray().map((item: Element) => {
            const $row = load(item.children);

            const $coasterName = $row('td:nth-of-type(2)').children('a');
            const id: number = getNumberOnly($coasterName.prop('href') + '');
            const name: string = $coasterName.first().text();
            const type: string = $row('td:nth-of-type(3)').first().text();
            const design: string = $row('td:nth-of-type(4)').first().text();
            const scale: string = $row('td:nth-of-type(5)').first().text();
            const date: string = $row('td > time').prop('datetime');

            return {id, name, type, design, scale, date, status};
          });
        })
        .flat() as ParkCoaster[];

      const socialMedia: SocialMedia = $socialMedia.toArray()?.reduce(
        (acc: any, element: Element): SocialMedia => {
          const mediaUrl: string = element.attribs.href;
          const mediaTypeNumber: number = getNumberOnly(element.attribs['data-background']);
          const mediaType: string = SOCIAL_MEDIA_MAPPER[mediaTypeNumber];

          return {
            ...acc,
            [mediaType]: mediaUrl,
          };
        },
        {
          twitter: '',
          facebook: '',
          website: '',
          youtube: '',
          instagram: '',
          pinterest: '',
        }
      );

      const themePark: ThemePark = {
        id,
        name: $('#feature h1').text(),
        city: $('#feature > div > a:nth-of-type(1)').text(),
        state: $('#feature > div > a:nth-of-type(2)').text(),
        country: $('#feature > div > a:nth-of-type(3)').text(),
        status: {
          state: statusDate.prev().text(),
          from: statusDate.prop('datetime'),
          to: statusDate.next().prop('datetime') ?? '',
        },
        mainPicture: parkPhotos.find((photo: Picture) => photo.id === mainPictureId),
        pictures: parkPhotos,
        socialMedia: socialMedia,
        coords: mapCoords,
        coasters: parkCoasters,
      };

      themeParks = [...themeParks, themePark];

      return themePark;
    };

    await this.scrapePages<ThemePark>(this._themParksUrl, onParkScrape);

    return themeParks;
  }
}
