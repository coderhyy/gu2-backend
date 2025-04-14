import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrainingRecordsService } from './training-records.service';
import { CreateTrainingRecordDto } from './dto/create-training-record.dto';
import { UpdateTrainingRecordDto } from './dto/update-training-record.dto';

@Controller('training-records')
export class TrainingRecordsController {
  constructor(private readonly trainingRecordsService: TrainingRecordsService) {}

  @Post()
  create(@Body() createTrainingRecordDto: CreateTrainingRecordDto) {
    return this.trainingRecordsService.create(createTrainingRecordDto);
  }

  @Get()
  findAll() {
    return this.trainingRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingRecordDto: UpdateTrainingRecordDto) {
    return this.trainingRecordsService.update(+id, updateTrainingRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingRecordsService.remove(+id);
  }
}
