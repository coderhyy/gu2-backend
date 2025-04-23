import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotifyService } from './notify.service';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { UpdateNotifyDto } from './dto/update-notify.dto';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post()
  create(@Body() createNotifyDto: CreateNotifyDto) {
    return this.notifyService.create(createNotifyDto);
  }

  @Get()
  findAll() {
    return this.notifyService.findAll();
  }

  @Get('coach/:coachId')
  findByCoach(@Param('coachId') coachId: string) {
    return this.notifyService.findByCoach(+coachId);
  }

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.notifyService.findByPlayer(+playerId);
  }

  @Get('team/:teamId')
  findByTeam(@Param('teamId') teamId: string) {
    return this.notifyService.findByTeam(+teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifyService.findOne(+id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notifyService.markAsRead(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotifyDto: UpdateNotifyDto) {
    return this.notifyService.update(+id, updateNotifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifyService.remove(+id);
  }
}
