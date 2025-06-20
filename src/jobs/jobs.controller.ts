import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { JobsService } from './jobs.service';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/guard/decorators/role.decorator';
import { roleEnum } from 'src/common/enum';
import { CreateJobDto } from './create-job.dto';
import { UpdateJobDto } from './update-job.dto';
  
  @ApiBearerAuth()
  @ApiTags('Jobs')
  @Controller('jobs')
  export class JobsController {
    constructor(private readonly jobsService: JobsService) {}
  
    @Post()
    @Roles(roleEnum.Company)
    async create(@Body() dto: CreateJobDto, @Request() req) {
      const job = await this.jobsService.create(dto, req.user.id);
      return {
        success: true,
        message: 'Job created successfully',
        object: job,
        errors: null,
      };
    }
  
    @Get('me')
    @Roles(roleEnum.Company)
    async findMyJobs(@Request() req) {
      const jobs = await this.jobsService.findMyJobs(req.user.id);
      return {
        success: true,
        message: 'Jobs fetched successfully',
        object: jobs,
        errors: null,
      };
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      const job = await this.jobsService.findOne(id);
      return {
        success: true,
        message: 'Job fetched successfully',
        object: job,
        errors: null,
      };
    }
  
    @Patch(':id')
    @Roles(roleEnum.Company)
    async update(@Param('id') id: string, @Body() dto: UpdateJobDto, @Request() req) {
      const job = await this.jobsService.update(id, dto, req.user.id);
      return {
        success: true,
        message: 'Job updated successfully',
        object: job,
        errors: null,
      };
    }
  
    @Delete(':id')
    @Roles(roleEnum.Company)
    async remove(@Param('id') id: string, @Request() req) {
      const result = await this.jobsService.remove(id, req.user.id);
      return {
        success: true,
        message: result.message,
        object: null,
        errors: null,
      };
    }
  }
  