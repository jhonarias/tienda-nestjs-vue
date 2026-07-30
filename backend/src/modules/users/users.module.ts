import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { UsersController } from './users.controller'
import { GetUsersUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase } from '../../core/application/use-cases/users/user.use-cases'

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [GetUsersUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase],
})
export class UsersModule {}
