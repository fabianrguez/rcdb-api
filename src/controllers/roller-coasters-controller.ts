import { RollerCoasterService } from '@app/services';
import { Controller, Get, Inject } from '@lib/decorators';
import type { Request, Response } from 'express';

@Controller('/api/coasters')
export default class RollerCoastersController {
  @Inject() private _rollercoasterService: RollerCoasterService;

  @Get()
  public indexRoute(req: Request, res: Response) {
    const { offset = '0', limit = '4000' } = req.query;

    this._rollercoasterService
      .getPaginatedCoasters(Number(offset), Number(limit))
      .then((coasters) => res.status(200).json(coasters))
      .catch((e: Error) => res.status(400).json({ error: e }));
  }

  @Get('/:id')
  public async getByIdRoute(req: Request, res: Response) {
    const { id } = req.params;

    const coaster = await this._rollercoasterService.getCoasterById(Number(id));

    if (coaster) {
      res.status(200).json(coaster);
    } else {
      res.status(404).json({ message: `Coaster ${id} not found` });
    }
  }
}
