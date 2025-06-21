import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ApplicationStatus {
  Applied = 'Applied',
  Reviewed = 'Reviewed',
  Interview = 'Interview',
  Rejected = 'Rejected',
  Hired = 'Hired',
}

export class UpdateStatusDto {
  @ApiProperty()
  @IsUUID()
  applicationId: string;

  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
