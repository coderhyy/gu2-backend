import { Module } from '@nestjs/common';
import { TrainingRecordsService } from './training-records.service';
import { TrainingRecordsController } from './training-records.controller';
import { Training } from 'src/trainings/entities/training.entity';
import { Player } from 'src/players/entities/player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Training, Player])],
  controllers: [TrainingRecordsController],
  providers: [TrainingRecordsService],
})
export class TrainingRecordsModule {}
