import { Request, Response, Handler, NextFunction } from 'express'
import { OutgoingMessage } from 'http'

import { TodosService } from '@services/service.todos'
import { Controller, Inject } from '@helpers/helper.di'
import { ApiResponse } from '@helpers/helper.apiResponse'
import { rawParser } from '@helpers/helper.rawParser'

@Controller()
export class TodosController {
  constructor(@Inject('TodosService') private service: TodosService) {}

  createTodos(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.createTodos(rawParser(req.body));
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  getAllTodos(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.getAllTodos(req)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  getTodosById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.getTodosById(req.params as any)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  deleteTodosById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.deleteTodosById(req.params as any)
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }

  updateTodosById(): Handler {
    return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
      try {
        const response: ApiResponse = await this.service.updateTodosById(req.params as any, rawParser(req.body))
        return res.status(response.stat_code).json(response)
      } catch (e: any) {
        return res.status(e.statusCode).json(e)
      }
    }
  }
}
