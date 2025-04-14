import { Injectable } from '@nestjs/common';
import { CreateTrainingRecordDto } from './dto/create-training-record.dto';
import { UpdateTrainingRecordDto } from './dto/update-training-record.dto';

@Injectable()
export class TrainingRecordsService {
  create(createTrainingRecordDto: CreateTrainingRecordDto) {
    return 'This action adds a new trainingRecord';
  }

  findAll() {
    return `This action returns all trainingRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainingRecord`;
  }

  update(id: number, updateTrainingRecordDto: UpdateTrainingRecordDto) {
    return `This action updates a #${id} trainingRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainingRecord`;
  }
}
