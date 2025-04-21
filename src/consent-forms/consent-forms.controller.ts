import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConsentFormsService } from './consent-forms.service';
import { CreateConsentFormDto } from './dto/create-consent-form.dto';
import { UpdateConsentFormDto } from './dto/update-consent-form.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MemberType } from '../auth/role.enum';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    member_type: MemberType;
    [key: string]: any;
  };
}

@Controller('consent-forms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsentFormsController {
  constructor(private readonly consentFormsService: ConsentFormsService) {}

  @Post()
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.PLAYER)
  create(
    @Body() createConsentFormDto: CreateConsentFormDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    return this.consentFormsService.create(createConsentFormDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }

    return this.consentFormsService.findAll(
      req.user.userId,
      req.user.member_type,
    );
  }

  @Get('player/:playerId')
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN)
  findByPlayer(@Param('playerId') playerId: string) {
    return this.consentFormsService.findByPlayer(+playerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    return this.consentFormsService.findOne(
      +id,
      req.user.sub,
      req.user.member_type,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsentFormDto: UpdateConsentFormDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    return this.consentFormsService.update(
      +id,
      updateConsentFormDto,
      req.user.sub,
      req.user.member_type,
    );
  }

  @Delete(':id')
  @Roles(MemberType.ADMIN, MemberType.CHAIRMAN)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    return this.consentFormsService.remove(
      +id,
      req.user.sub,
      req.user.member_type,
    );
  }
}
