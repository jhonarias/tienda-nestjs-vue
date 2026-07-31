import type { IUserService, CreateUserDTO, UpdateUserDTO } from '../../../domain/ports/IUserService'
import type { User } from '../../../domain/entities/User'

export class GetUsersUseCase {
  constructor(private readonly userService: IUserService) {}

  async execute(): Promise<User[]> {
    return this.userService.getAll()
  }
}

export class CreateUserUseCase {
  constructor(private readonly userService: IUserService) {}

  async execute(data: CreateUserDTO): Promise<User> {
    return this.userService.create(data)
  }
}

export class UpdateUserUseCase {
  constructor(private readonly userService: IUserService) {}

  async execute(id: string, data: UpdateUserDTO): Promise<User> {
    return this.userService.update(id, data)
  }
}

export class DeleteUserUseCase {
  constructor(private readonly userService: IUserService) {}

  async execute(id: string): Promise<void> {
    return this.userService.remove(id)
  }
}
