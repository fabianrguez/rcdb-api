import { RollerCoasterService } from '@app/services';
import { Controller, Get, Inject } from '@lib/decorators';
import type { Request, Response } from 'express';
import RollerCoaster from 'types/roller-coaster';

@Controller('/api/coasters')
export default class RollerCoastersController {
  @Inject() private _rollercoasterService: RollerCoasterService;

  @Get()
  public indexRoute(req: Request, res: Response) {
    const { offset = '0', limit = '1000' } = req.query;

    this._rollercoasterService
      .getPaginatedCoasters(Number(offset), Number(limit))
      .then((coasters) => res.status(200).json(coasters))
      .catch((e: Error) => res.status(400).json({ error: e }));
  }

  @Get('/:id([0-9]+)')
  public async getByIdRoute(req: Request, res: Response) {
    const { id } = req.params;

    const coaster = await this._rollercoasterService.getCoasterById(Number(id));

    if (coaster) {
      res.status(200).json(coaster);
    } else {
      res.status(404).json({ message: `Coaster ${id} not found` });
    }
  }

  @Get('/random')
  public async getRandomCoasterRoute(req: Request, res: Response) {
    try {
      const randomCoaster: RollerCoaster = await this._rollercoasterService.getRandomCoaster();
      res.status(200).json(randomCoaster);
    } catch (e: any) {
      res.status(400).json({ message: 'Error getting a random coaster', cause: e });
    }
  }

  @Get('/search')
  public async searchCoasterRoute(req: Request, res: Response) {
    const { q = '' } = req.query;

    if (!q) res.status(400).json([]);

    const matchedCoasters: RollerCoaster[] = await this._rollercoasterService.searchCoasters(q as string);

    res.status(200).json({ coasters: matchedCoasters, totalMatch: matchedCoasters.length });
  }
}
