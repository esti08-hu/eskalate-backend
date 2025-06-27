import {
    Controller,
    Post,
    UseGuards,
    Request,
    UploadedFile,
    UseInterceptors,
    Body,
    Get,
    Query,
    Param,
    Patch,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApplicationsService } from './applications.service';
  import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import { Roles } from 'src/common/guard/decorators/role.decorator';
import { roleEnum } from 'src/common/enum';
import { UpdateStatusDto } from './update-status.dto';
  
  @ApiTags('Applications')
  @ApiBearerAuth()
  @Controller('applications')
  export class ApplicationsController {
    constructor(private readonly appService: ApplicationsService) {}
  
    @Post('apply')
    @Roles(roleEnum.Applicant)
    @UseInterceptors(FileInterceptor('resume'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          resume: { type: 'string', format: 'binary' },
          jobId: { type: 'string', format: 'uuid' },
          coverLetter: { type: 'string' },
        },
        required: ['resume', 'jobId'],
      },
    })
    async apply(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateApplicationDto,
      @Request() req,
    ) {
      const app = await this.appService.applyToJob(dto, file, req.user.id);
      return {
        success: true,
        message: 'Application submitted successfully',
        object: app,
        errors: null,
      };
    }
  
    @Get('my-applications')
    @Roles(roleEnum.Applicant)
    async getMyApplications(
      @Request() req,
      @Query('page') page = 1,
      @Query('limit') limit = 10,
    ) {
      return this.appService.getMyApplications(req.user.id, +page, +limit);
    }
  
    @Get('job/:jobId')
    @Roles(roleEnum.Company)
    async getApplicants(
      @Param('jobId') jobId: string,
      @Request() req,
      @Query('page') page = 1,
      @Query('limit') limit = 10,
    ) {
      return this.appService.getApplicationsForJob(jobId, req.user.id, +page, +limit);
    }
  
    @Patch('update-status')
    @Roles(roleEnum.Company)
    async updateStatus(@Body() dto: UpdateStatusDto, @Request() req) {
      const updated = await this.appService.updateApplicationStatus(dto, req.user.id);
      return {
        success: true,
        message: 'Status updated successfully',
        object: updated,
        errors: null,
      };
    }
  }
  