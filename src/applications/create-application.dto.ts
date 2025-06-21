import {
    IsOptional,
    IsString,
    IsUUID,
    Length,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateApplicationDto {
    @ApiProperty()
    @IsUUID()
    jobId: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 200)
    coverLetter?: string;
  }
  