import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from '../auth/password.service';

@Module({
  providers: [UsersService, PasswordService],
  controllers: [UsersController]
})
export class UsersModule {}
