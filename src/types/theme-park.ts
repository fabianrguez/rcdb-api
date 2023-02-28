import ParkCoaster from './park-coaster';
import type Picture from './picture';

export declare type SocialMedia = {
  twitter: string;
  facebook: string;
  website: string;
  youtube: string;
  instagram: string;
  pinterest: string;
};

export default interface ThemePark {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
  status: {
    state: string;
    from: string;
    to: string;
  };
  mainPicture: Picture | undefined;
  pictures: Picture[];
  socialMedia: SocialMedia;
  coords: {
    lat: string;
    lng: string;
  };
  coasters: ParkCoaster[];
}
