import type { Picture } from '@app/types';

export interface Stats {
  length?: string;
  height?: string;
  speed?: string;
  inversions?: string;
  duration?: string;
  arrangement?: string;
  capacity?: string;
  dimensions?: any[] | string;
  designer?: string;
  verticalAngle?: string;
  gForce?: string;
  drop?: string;
  cost?: string;
  builtBy?: string;
  elements?: string[] | string;
  formerNames?: string;
}

export default interface RollerCoaster {
  id: number;
  name: string;
  park: {
    id: number;
    name: string;
  };
  city: string;
  state: string;
  region: string;
  status: {
    state: string;
    date: {
      opened: string;
      closed?: string;
    };
  };
  country: string;
  link: string;
  make: string;
  model: string;
  type: string;
  design: string;
  stats?: Stats;
  mainPicture: Picture | undefined;
  pictures: Picture[];
  coords: {
    lat: string | undefined;
    lng: string | undefined;
  };
}
