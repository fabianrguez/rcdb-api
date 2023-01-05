import { Methods } from '@lib/types';

export default interface Route {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}
