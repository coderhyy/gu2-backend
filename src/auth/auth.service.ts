import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembersService } from '../members/members.service';
import * as bcrypt from 'bcrypt';

import { Member } from '../members/entities/member.entity';

@Injectable()
export class AuthService {
  constructor(
    private membersService: MembersService,
    private jwtService: JwtService,
  ) {}

  async validateMember(
    email: string,
    password: string,
  ): Promise<Omit<Member, 'password'> | null> {
    const member = await this.membersService.findByEmail(email);
    if (!member) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return null;
    }

    // 不返回密码字段
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = member;
    return result;
  }

  login(member?: Member) {
    if (!member) {
      return null;
    }

    const payload = {
      email: member.email,
      sub: member.id,
      role: member.role,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    };
  }
}
