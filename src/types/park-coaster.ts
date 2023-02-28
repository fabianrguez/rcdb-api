export default interface ParkCoaster {
  id: number;
  name: string;
  type: string;
  design: string;
  scale: string;
  date: string;
  status: 'closed' | 'opened' | 'opening';
}
