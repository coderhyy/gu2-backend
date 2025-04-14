import { Controller, Post, UseGuards, Get, Body, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CreateMemberDto } from '../members/dto/create-member.dto';
import { MembersService } from '../members/members.service';
import { Request } from 'express';
import { Member } from '../members/entities/member.entity';
import { CoachesService } from '../coaches/coaches.service';
import { PlayersService } from '../players/players.service';
import { MemberType } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private membersService: MembersService,
    private coachesService: CoachesService,
    private playersService: PlayersService,
  ) {}

  @Post('register')
  async register(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.membersService.register(createMemberDto);

    // 根据会员类型创建相应的角色记录
    if (createMemberDto.member_type === MemberType.COACH) {
      await this.coachesService.create({
        member_id: member.member_id,
        member,
        ...createMemberDto,
      });
    } else if (createMemberDto.member_type === MemberType.PLAYER) {
      await this.playersService.create({
        member_id: member.member_id,
        member,
        ...createMemberDto,
      });
    }

    return this.authService.login(member);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as Member);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-profile')
  getAdminProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coach')
  @Get('coach-profile')
  getCoachProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Get('player-profile')
  getPlayerProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
