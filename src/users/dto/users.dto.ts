import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { roleEnum } from 'src/common/enum';

export class UserLoginDto {
  @IsEmail()
  @ApiProperty({
    example: "example@gmail.com"
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: "password123"
  })
  password: string;

  @IsEnum(roleEnum)
  @IsOptional()
  @ApiProperty({
    example: 'applicant',
    enum: roleEnum,
    required: false
  })
  role?: roleEnum;
}

export class UserRegisterDto extends UserLoginDto {
  @ApiProperty({
    example: "John Doe"
  })
  @IsString()
  @MinLength(2)
  name: string;
}