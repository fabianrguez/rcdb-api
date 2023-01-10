import { Controller, Get } from '@lib/decorators';
import type { Request, Response } from 'express';

@Controller()
export default class IndexController {
  @Get()
  public indexRoute(_: Request, res: Response) {
    res.json([
      { endpoint: '/api/coasters?offset=0&limit=20', description: 'Returns all coasters information' },
      { endpoint: '/test-vercel-action-deploy' },
    ]);
  }
}
