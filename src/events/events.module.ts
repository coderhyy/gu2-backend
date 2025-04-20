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
import { GameRule } from '../game-rules/entities/game-rule.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Player, Coach, Member, GameRule, Team])
  ],
  controllers: [EventsController, TestEventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
