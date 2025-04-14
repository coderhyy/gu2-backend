import { Module } from '@nestjs/common';
import { MatchPerformanceService } from './match-performance.service';
import { MatchPerformanceController } from './match-performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchPerformance } from './entities/match-performance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchPerformance])],
  controllers: [MatchPerformanceController],
  providers: [MatchPerformanceService],
})
export class MatchPerformanceModule {}
