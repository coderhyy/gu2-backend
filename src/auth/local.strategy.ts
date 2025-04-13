// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // 使用email作为用户名字段
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<Member, 'password'>> {
    const member = await this.authService.validateMember(email, password);
    if (!member) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
