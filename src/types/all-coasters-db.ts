import type RollerCoaster from './roller-coaster';

export default interface AllCoastersDB {
  coasters: {
    [key: string]: RollerCoaster;
  };
}
