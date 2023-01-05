import { RollerCoasterService } from '@app/services';
import { Controller, Get, Inject } from '@lib/decorators';
import type { Request, Response } from 'express';

@Controller('/api/coasters')
export default class RollerCoastersController {
  @Inject() private _rollercoasterService: RollerCoasterService;

  @Get('')
  public indexRoute(_: Request, res: Response) {
    this._rollercoasterService
      .getAllCoasters()
      .then((coasters) => res.status(200).json({ data: coasters, totalItems: coasters.length }))
      .catch((e: Error) => res.status(400).json({ error: e }));
  }
}
