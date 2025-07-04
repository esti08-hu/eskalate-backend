import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';

@Module({
  providers: [ApplicationsService],
  controllers: [ApplicationsController]
})
export class ApplicationsModule {}
