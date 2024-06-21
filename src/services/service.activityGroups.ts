import { StatusCodes as status } from 'http-status-codes'
import { DeleteResult } from 'typeorm'

import { Activities } from '@entities/entitie.activityGroups'
import { Inject, Service, Repository } from '@helpers/helper.di'
import { apiResponse, ApiResponse } from '@helpers/helper.apiResponse'
import { DTOActivityGroups, DTOActivityGroupsId } from '@dtos/dto.activityGroups'

@Service()
export class ActivityGroupsService {
  constructor(@Inject('ActivityGroupsModel') private model: Repository<Activities>) {}

  async createActivityGroups(body: DTOActivityGroups): Promise<ApiResponse> {
    try {
      if (!body.hasOwnProperty('title') || body.title === '')
        throw apiResponse({
          stat_code: status.BAD_REQUEST,
          stat_message: `title cannot be null`
        })

      const todos: InstanceType<typeof Activities> = new Activities()
      todos.title = body.title
      todos.email = body.email

      const insertData: Activities = await this.model.save(todos)
      if (!insertData) throw apiResponse({
        stat_code: status.BAD_REQUEST,
        stat_message: `Failed to create new Activity Group`

      })

      return Promise.resolve(apiResponse({
        stat_code: status.CREATED,
        stat_message: 'Success',
        data: insertData


      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message


      }))
    }
  }

  async getAllActivityGroups(): Promise<ApiResponse> {
    try {
      const getAllActivity: Activities[] = await this.model.find({})

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: getAllActivity
      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message

      }))
    }
  }

  async getActivityGroupsById(params: DTOActivityGroupsId): Promise<ApiResponse> {
    try {
      const getActivityById: Activities = await this.model.findOne({ id: params.id })
      if (!getActivityById) throw apiResponse({
        stat_code: status.NOT_FOUND,
        stat_message: `Activity with ID ${params.id} Not Found`
      })

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: getActivityById
      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message

      }))
    }
  }

  async deleteActivityGroupsById(params: DTOActivityGroupsId): Promise<ApiResponse> {
    try {
      const getActivityById: Activities = await this.model.findOne({ id: params.id })
      if (!getActivityById) throw apiResponse({
        stat_code: status.NOT_FOUND,
        stat_message: `Activity with ID ${params.id} Not Found`
      })

      const deleteData: DeleteResult = await this.model.delete({ id: getActivityById.id })
      if (!deleteData) throw apiResponse({
        stat_code: status.BAD_REQUEST,
        stat_message: `Failed to delete Activity with ID ${params.id}`

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

  async updateActivityGroupsById(params: DTOActivityGroupsId, body: DTOActivityGroups): Promise<ApiResponse> {
    try {
      const checkActivityId: Activities = await this.model.findOne({ id: params.id })
      if (!checkActivityId) throw apiResponse({
        stat_code: status.NOT_FOUND,
        stat_message: `Activity with ID ${params.id} Not Found`
      })

      checkActivityId.title = body.title

      const updateData = await this.model.save(checkActivityId)
      if (!updateData) throw apiResponse({
        stat_code: status.BAD_REQUEST,
        stat_message: `Failed to update Activity with ID ${params.id}`

      })

      return Promise.resolve(apiResponse({
        stat_code: status.OK,
        stat_message: 'Success',
        data: updateData
      }))
    } catch (e: any) {
      return Promise.reject(apiResponse({
        stat_code: e.stat_code || status.BAD_REQUEST,
        stat_message: e.stat_message || e.message
      }))
    }
  }
}
