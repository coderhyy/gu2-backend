// src/events/events.controller.ts
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
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MemberType } from '../auth/role.enum';
import { Request } from 'express';

// 扩展Request类型
interface RequestWithUser extends Request {
  user: {
    sub: number;
    member_type: MemberType;
    [key: string]: any;
  };
}

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  createCompetition(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }

    // 将当前用户设为创建者
    createEventDto.created_by = req.user.sub;
    return this.eventsService.createCompetition(createEventDto);
  }

  @Get('published')
  findAllPublished() {
    return this.eventsService.findAllPublished();
  }

  @Get()
  // @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  queryCompetitionDetails(@Param('id') id: string) {
    return this.eventsService.queryCompetitionDetails(+id);
  }

  @Patch(':id')
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  async updateCompetitionInfo(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }

    // 获取当前用户角色
    const userRole = req.user.member_type;

    // 如果不是管理员或主席，获取赛事详情检查创建者
    if (userRole !== MemberType.ADMIN && userRole !== MemberType.CHAIRMAN) {
      const event = await this.eventsService.queryCompetitionDetails(+id);

      // 只有创建者、管理员或主席可以编辑
      if (event.created_by?.member_id !== req.user.sub) {
        throw new ForbiddenException('只有创建者、管理员或主席可以编辑赛事');
      }
    }

    return this.eventsService.updateCompetitionInfo(+id, updateEventDto);
  }

  @Post(':id/publish')
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  async publishEvent(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }

    // 获取当前用户角色
    const userRole = req.user.member_type;

    // 如果不是管理员或主席，获取赛事详情检查创建者
    if (userRole !== MemberType.ADMIN && userRole !== MemberType.CHAIRMAN) {
      const event = await this.eventsService.queryCompetitionDetails(+id);

      // 只有创建者、管理员或主席可以发布
      if (event.created_by?.member_id !== req.user.sub) {
        throw new ForbiddenException('只有创建者、管理员或主席可以发布赛事');
      }
    }

    return this.eventsService.publishEvent(+id);
  }

  @Delete(':id')
  @Roles(MemberType.ADMIN, MemberType.CHAIRMAN)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
