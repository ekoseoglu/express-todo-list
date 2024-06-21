import { StatusCodes as status } from 'http-status-codes'
import { Request } from 'express'
import { DeleteResult } from 'typeorm'

import { Todos } from '@entities/entitie.todos'
import { Activities } from '@entities/entitie.activityGroups'
import { Inject, Service, Repository } from '@helpers/helper.di'
import { apiResponse, ApiResponse } from '@helpers/helper.apiResponse'
import { DTOTodos, DTOTodosId } from '@dtos/dto.todos'

@Service()
export class TodosService {
  constructor(@Inject('TodosModel') private model: Repository<Todos>, @Inject('ActivityGroupsModel') private activityGroups: Repository<Activities>) {
  }

  async createTodos(body: DTOTodos): Promise<ApiResponse> {
    try {
      if (!body.hasOwnProperty('title') || body.title === '') {
        throw apiResponse({
          stat_code: status.BAD_REQUEST,
          stat_message: `title cannot be null`
        })
      } else if (!body.hasOwnProperty('activity_group_id') || body.activity_group_id === '') {
        throw apiResponse({
          stat_code: status.BAD_REQUEST,
          stat_message: `activity_group_id cannot be null`
        })
      }

      const checkActivityId: Activities = await this.activityGroups.findOne({ id: body.activity_group_id })
      if (!checkActivityId) {
        throw apiResponse({
          stat_code: status.NOT_FOUND,
          stat_message: `Activity Group with ID ${body.activity_group_id} Not Found`
        })
      }

      const todos: InstanceType<typeof Todos> = new Todos()
      todos.title = body.title
      todos.activity_group_id = body.activity_group_id
      todos.priority = 'very-high'

      const insertData: Todos = await this.model.save(todos)
      if (!insertData) {
        throw apiResponse({
          stat_code: status.BAD_REQUEST,
          stat_message: `Failed to create new Todos`

        })
      }

      return Promise.resolve(apiResponse({
        stat_code: status.CREATED,
        stat_message: 'Success',
        data: insertData

      }))
    } catch (e: any) {
      console.log({
        e
      })
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message

      }))
    }
  }

  async getAllTodos(req: Request): Promise<ApiResponse> {
    try {
      let getAllTodosResult: Todos[]

      if (req.query.hasOwnProperty('activity_group_id')) {
        getAllTodosResult = await this.model.find({ activity_group_id: req.query.activity_group_id as any })
      } else {
        getAllTodosResult = await this.model.find({})
      }

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: getAllTodosResult

      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message
      }))
    }
  }

  async getTodosById(params: DTOTodosId): Promise<ApiResponse> {
    try {
      const getTodoById: Todos = await this.model.findOne({ id: params.id }, { order: { id: 'DESC' } })
      if (!getTodoById) throw apiResponse({
        stat_code: status.NOT_FOUND,
        stat_message: `Todo with ID ${params.id} Not Found`

      })

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: getTodoById
      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message

      }))
    }
  }

  async deleteTodosById(params: DTOTodosId): Promise<ApiResponse> {
    try {
      const getTodoById: Todos = await this.model.findOne({ id: params.id })
      if (!getTodoById) throw apiResponse({
        stat_code: status.NOT_FOUND,
        stat_message: `Todo with ID ${params.id} Not Found`


      })

      const deleteData: DeleteResult = await this.model.delete({ id: getTodoById.id })
      if (!deleteData) throw apiResponse({
        stat_code: status.BAD_REQUEST,
        stat_message: `Failed to delete Todo with ID ${params.id}`
      })

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: deleteData
      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message

      }))
    }
  }

  async updateTodosById(params: DTOTodosId, body: DTOTodos): Promise<ApiResponse> {
    try {
      let getDataTodo: Todos

      const checkTodoById: Todos = await this.model.findOne({ id: params.id })
      if (!checkTodoById) throw apiResponse({
        stat_code: status.NOT_FOUND,
        stat_message: `Todo with ID ${params.id} Not Found`
      })

      if (body.hasOwnProperty('title') || body.hasOwnProperty('activity_group_id')) {
        checkTodoById.title = body.title
        checkTodoById.activity_group_id = body.activity_group_id

        const updateData = await this.model.save(checkTodoById)
        if (!updateData) throw apiResponse({
          stat_code: status.BAD_REQUEST,
          stat_message: `Failed to update Todo with ID ${params.id}`
        })

        getDataTodo = updateData
      } else {
        getDataTodo = checkTodoById
      }

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: getDataTodo
      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message
      }))
    }
  }
}
