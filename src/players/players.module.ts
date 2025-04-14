// src/players/players.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Player } from './entities/player.entity';
import { Member } from 'src/members/entities/member.entity';
import { TrainingRecord } from 'src/training-records/entities/training-record.entity';
import { ConsentForm } from 'src/consent-forms/entities/consent-form.entity';
import { MatchPerformance } from 'src/match-performance/entities/match-performance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      Member,
      TrainingRecord,
      ConsentForm,
      MatchPerformance,
    ]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
