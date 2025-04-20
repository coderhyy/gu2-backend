import { Module } from '@nestjs/common';
import { MatchPerformanceService } from './match-performance.service';
import { MatchPerformanceController } from './match-performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchPerformance } from './entities/match-performance.entity';
import { Player } from '../players/entities/player.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchPerformance, Player, Event])],
  controllers: [MatchPerformanceController],
  providers: [MatchPerformanceService],
})
export class MatchPerformanceModule {}
