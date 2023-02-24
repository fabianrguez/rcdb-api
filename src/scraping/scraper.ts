import type { Picture, RcdbPicture } from 'types';
import axiosInstance from './axios-instance';
import type { CheerioAPI } from 'cheerio';

export default class Scraper {
  protected async fetchUrl<TData = any>(url: string): Promise<TData> {
    const { data } = await axiosInstance.get(url).catch(() => ({ data: {} }));

    return data;
  }

  protected getPhotos($: CheerioAPI): Picture[] {
    const photos: RcdbPicture[] = JSON.parse($('#pic_json').text()).pictures;

    return photos.map((photo: RcdbPicture) => ({
      id: photo.id,
      name: photo.name,
      url: photo.url,
      copyName: photo.copy_name,
      copyDate: photo.copy_date,
    }));
  }

}
