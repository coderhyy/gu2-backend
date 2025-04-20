import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { ScheduleItem } from './entities/schedule-item.entity';
import { Event } from '../events/entities/event.entity';
import { Team } from '../teams/entities/team.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, ScheduleItem, Event, Team]),
    EventsModule
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService]
})
export class SchedulesModule {} 