import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { Training } from './entities/training.entity';
import { Coach } from '../coaches/entities/coach.entity';
import { Player } from '../players/entities/player.entity';
import { TrainingRecord } from '../training-records/entities/training-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Training, Coach, Player, TrainingRecord]),
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
