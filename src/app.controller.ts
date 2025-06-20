import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/guard/decorators/role.decorator';
import { roleEnum } from './common/enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(roleEnum.Applicant)
  getHello(): string {
    return this.appService.getHello();
  }
}
