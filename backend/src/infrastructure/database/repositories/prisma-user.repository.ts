// ============================================================
// ADAPTADOR: PrismaUserRepository
// Implementa IUserRepository — NestJS lo provee como token
// ============================================================

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import type { IUserRepository, CreateUserData, UpdateUserData } from '../../../core/domain/ports/user-repository.port'
import type { User, UserPublic } from '../../../core/domain/entities/user.entity'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserPublic[]> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return users.map((user: any) => {
      const { password: _pwd, ...u } = user
      return u as UserPublic
    })
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } }) as Promise<User | null>
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } }) as Promise<User | null>
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<User | null>
  }

  async create(data: CreateUserData): Promise<UserPublic> {
    const user = await this.prisma.user.create({ data })
    const { password: _pwd, ...publicUser } = user
    return publicUser as UserPublic
  }

  async update(id: string, data: UpdateUserData): Promise<UserPublic> {
    const user = await this.prisma.user.update({ where: { id }, data })
    const { password: _pwd, ...publicUser } = user
    return publicUser as UserPublic
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }
}
