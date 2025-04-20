// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.log(`Required roles: ${JSON.stringify(requiredRoles)}`);
    
    if (!requiredRoles) {
      this.logger.log('No roles required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    this.logger.log(`Request headers: ${JSON.stringify(request.headers)}`);
    
    const { user } = request;
    
    if (!user) {
      this.logger.warn('User object is undefined in request');
      return false;
    }
    
    // 记录日志
    this.logger.log(`User role: ${user.member_type}`);
    this.logger.log(`User object: ${JSON.stringify(user)}`);
    
    const hasRole = requiredRoles.some((role) => user.member_type === role);
    this.logger.log(`Has required role: ${hasRole}`);
    
    // 使用member_type字段作为角色标识
    return hasRole;
  }
}
