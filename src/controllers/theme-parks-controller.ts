import { ThemeParkService } from '@app/services';
import { Controller, Get, Inject } from '@lib/decorators';
import type { Request, Response } from 'express';
import { ThemePark } from '@app/types';

@Controller('/api/theme-parks')
export default class ThemeParksController {
  @Inject() private _themeParkService: ThemeParkService;

  @Get()
  public indexRoute(req: Request, res: Response): void {
    const { offset = '0', limit = '1000' } = req.query;

    this._themeParkService
      .getPaginatedThemeParks(Number(offset), Number(limit))
      .then((themeParks) => res.status(200).json(themeParks))
      .catch((e: Error) => res.status(400).json({ error: e }));
  }

  @Get('/:id([0-9]+)')
  public async getByIdRoute(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const themePark: ThemePark | undefined = await this._themeParkService.getThemeParkById(Number(id));

    if (themePark) {
      res.status(200).json(themePark);
    } else {
      res.status(400).json({ message: `Theme Park ${id} not found` });
    }
  }
}
