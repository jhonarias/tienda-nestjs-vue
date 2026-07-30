// ============================================================
// CASOS DE USO: Usuarios
// ============================================================

import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import {
  USER_REPOSITORY,
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../../../domain/ports/user-repository.port'
import type { UserPublic } from '../../../domain/entities/user.entity'

const SALT_ROUNDS = 12

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(): Promise<UserPublic[]> {
    return this.userRepo.findAll()
  }
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(data: Omit<CreateUserData, 'password'> & { password: string }): Promise<UserPublic> {
    const [existingUser, existingEmail] = await Promise.all([
      this.userRepo.findByUsername(data.username),
      this.userRepo.findByEmail(data.email),
    ])

    if (existingUser) throw new ConflictException('El nombre de usuario ya está en uso')
    if (existingEmail) throw new ConflictException('El correo electrónico ya está en uso')

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
    return this.userRepo.create({ ...data, password: hashedPassword })
  }
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string, data: UpdateUserData): Promise<UserPublic> {
    const user = await this.userRepo.findById(id)
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return this.userRepo.update(id, data)
  }
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepo.findById(id)
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return this.userRepo.delete(id)
  }
}
