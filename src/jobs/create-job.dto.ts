import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @ApiProperty({
    description: 'Title of the job position',
    example: 'Software Engineer',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(20, 2000)
  @ApiProperty({
    description: 'Detailed description of the job responsibilities and requirements',
    example: 'We are looking for a skilled software engineer to join our team...',
  })
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  @ApiProperty({
    description: 'Location of the job (optional)',
    example: 'Remote',
    required: false,
  })
  location?: string;
}
