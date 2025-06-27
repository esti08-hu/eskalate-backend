import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/guard/decorators/role.decorator';
import { roleEnum } from './common/enum';
import { Public } from './common/guard/decorators/auth.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
