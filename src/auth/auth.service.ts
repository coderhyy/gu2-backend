/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembersService } from '../members/members.service';
import * as bcrypt from 'bcrypt';

import { MemberType } from './role.enum';
import { PlayersService } from '../players/players.service';
import { CoachesService } from '../coaches/coaches.service';
@Injectable()
export class AuthService {
  constructor(
    private membersService: MembersService,
    private playersService: PlayersService,
    private coachesService: CoachesService,
    private jwtService: JwtService,
  ) {}

  async validateMember(email: string, password: string): Promise<any | null> {
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

    if (member.member_type === MemberType.PLAYER) {
      const player = await this.playersService.findOne(
        member.member_id.toString(),
      );
      if (player) {
        return {
          ...result,
          player,
        };
      }
    }

    if (member.member_type === MemberType.COACH) {
      const coach = await this.coachesService.findOne(
        member.member_id.toString(),
      );
      if (coach) {
        return {
          ...result,
          coach,
        };
      }
    }

    return result;
  }

  login(member?: any) {
    if (!member) {
      return null;
    }

    const payload = {
      email: member.email,
      sub: member.member_id,
      member_type: member.member_type,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: member.member_id,
        name: member.name,
        email: member.email,
        member_type: member.member_type,
        player: member.player,
        coach: member.coach,
      },
    };
  }
}
