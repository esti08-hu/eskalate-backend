import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(20, 2000)
  description: string;

  @IsOptional()
  @IsString()
  location?: string;
}
