// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TestEventsController } from './test.controller';
import { Event } from './entities/event.entity';
import { Player } from '../players/entities/player.entity';
import { Coach } from '../coaches/entities/coach.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Player, Coach, Member])],
  controllers: [EventsController, TestEventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
