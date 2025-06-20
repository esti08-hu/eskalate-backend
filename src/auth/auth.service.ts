import { BadRequestException, Injectable } from "@nestjs/common";
import { UserLoginDto, UserRegisterDto } from "src/users/dto/users.dto";
import { UsersService } from "src/users/users.service";
import { PasswordService } from "./password.service";
import { JwtService } from '@nestjs/jwt';
import { sql } from "drizzle-orm";
import { roleEnum } from "src/common/enum";
import { AccessTokenPayload, RefreshTokenPayload } from "./auth.interfaces";

@Injectable()
export class AuthService {
    constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Logic to validate user credentials
    return null; // Placeholder return value
  }

  async register(userDto: UserRegisterDto): Promise<any> {
    const existingUser = await this.usersService.getUserByEmail(userDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.usersService.createUser({
      ...userDto,
      role: userDto.role || roleEnum.Applicant, 
    });
    return newUser;
  }

  async login(data: UserLoginDto): Promise<any> {
    const user = await this.usersService.getUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role === roleEnum.Company) {
      return this.companyLogin(data);
    } else if (user.role === roleEnum.Applicant) {
      return this.applicantLogin(data);
    } else {
      throw new BadRequestException('Invalid user role');
    }
  }

  async companyLogin(data: UserLoginDto): Promise<any> {
    const user = await this.usersService.getUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await this.passwordService.validateUser(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');    
    }
    const accessTokenPayload: AccessTokenPayload = {
      id: user.userId,
      email: user.email,
      roles: [roleEnum.Company],
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      email: user.email,
      roles: [roleEnum.Company],
    };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload);
    return {
      accessToken,
      refreshToken,
      role: roleEnum.Company,
    };
  }

  async applicantLogin(data: UserLoginDto): Promise<any> {
    const user = await this.usersService.getUserByEmail(data.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    const isPasswordValid = await this.passwordService.validateUser(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const accessTokenPayload: AccessTokenPayload = {
      id: user.userId,
      email: user.email,
      roles: [roleEnum.Applicant],
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      email: user.email,
      roles: [roleEnum.Applicant],
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload);

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload);

    return {
      accessToken,
      refreshToken,
      role: roleEnum.Applicant,
    };
  }

}