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
  parkName: string;
  city: string;
  state: string;
  status: {
    state: string;
    date: string;
  };
  country: string;
  link: string;
  make: string;
  model: string;
  type: string;
  design: string;
  stats?: Stats;
}
