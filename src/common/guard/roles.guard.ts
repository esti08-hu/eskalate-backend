import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleEnum } from '../enum';
import { ROLES_KEY } from './decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<roleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
