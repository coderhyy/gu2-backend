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
  Query,
  UnauthorizedException
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
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

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll(@Query('event_id') eventId?: string) {
    if (eventId) {
      return this.schedulesService.findByEvent(+eventId);
    }
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Post(':id/publish')
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  publish(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    return this.schedulesService.publish(+id, req.user.sub);
  }

  @Delete(':id')
  @Roles(MemberType.ADMIN, MemberType.CHAIRMAN)
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
} 