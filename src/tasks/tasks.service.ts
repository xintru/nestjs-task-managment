import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskRepository } from './task.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto)
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne(id)
      if (!task) {
        throw new NotFoundException(`Task with ID "${id} not found"`)
      }
      return task
    } catch (error) {
      throw error
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto)
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id)
    task.status = status
    return await task.save()
  }

  async deleteTask(id: number): Promise<void> {
    try {
      const result = await this.taskRepository.delete(id)

      // decided to explicitly state that it's gonna be a number, not bool
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID "${id} not found"`)
      }
    } catch (error) {
      throw error
    }
  }
}
