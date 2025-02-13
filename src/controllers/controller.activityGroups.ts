import { Request, Response, Handler, NextFunction } from 'express'
import { OutgoingMessage } from 'http'

import { ActivityGroupsService } from '@services/service.activityGroups'
import { Controller, Inject } from '@helpers/helper.di'
import { ApiResponse } from '@helpers/helper.apiResponse'
import { rawParser } from '@helpers/helper.rawParser'

@Controller()
export class ActivityGroupsController {
  constructor(@Inject('ActivityGroupsService') private service: ActivityGroupsService) {}

  createActivityGroups(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.createActivityGroups(rawParser(req.body))
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  getAllActivityGroups(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.getAllActivityGroups()
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  getActivityGroupsById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.getActivityGroupsById(req.params as any)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  updateActivityGroupsById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.updateActivityGroupsById(req.params as any, rawParser(req.body))
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  deleteActivityGroupsById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.deleteActivityGroupsById(req.params as any)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }
}
