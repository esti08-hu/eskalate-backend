import { Controller, Post, Body, Response, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto } from 'src/users/dto/users.dto';
import { cookiePresets, setCookie } from 'src/common/utils/cookie.utils';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/guard/decorators/auth.decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() userDto: UserRegisterDto) {
    const user = await this.authService.register(userDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Post('login') 
  @Public()
  async login(@Body() loginDto: UserLoginDto,
  @Response({ passthrough: true }) res,
  @Request() req,) {
    const { refreshToken, accessToken, role } = await this.authService.login(loginDto);
    
    setCookie(res, 'refresh_token', refreshToken, cookiePresets.refreshToken);
    setCookie(res, 'access_token', accessToken, cookiePresets.accessToken);
    setCookie(res, 'user_role', role , cookiePresets.userRole);

    return {
        message: 'Login successful',
        accessToken,
        refreshToken,
        role,
    }
  }

  @Post('logout')
  @Public()
  async logout(@Response({ passthrough: true }) res) {
    setCookie(res, 'refresh_token', '', cookiePresets.refreshToken);
    setCookie(res, 'access_token', '', cookiePresets.accessToken);
    setCookie(res, 'user_role', '', cookiePresets.userRole);

    return {
      message: 'Logout successful',
    };
  }

}
