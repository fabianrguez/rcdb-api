import { RollerCoasterService } from '@app/services';
import { Controller, Get, Inject } from '@lib/decorators';
import type { Request, Response } from 'express';

@Controller('/api/coasters')
export default class RollerCoastersController {
  @Inject() private _rollercoasterService: RollerCoasterService;

  @Get('')
  public indexRoute(req: Request, res: Response) {
    const { offset = '0', limit = Infinity } = req.query;

    this._rollercoasterService
      .getAllCoasters(Number(offset), Number(limit))
      .then((coasters) => res.status(200).json({ data: coasters, totalItems: coasters.length }))
      .catch((e: Error) => res.status(400).json({ error: e }));
  }
}
