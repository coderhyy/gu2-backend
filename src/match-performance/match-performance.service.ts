import { Injectable } from '@nestjs/common';
import { CreateMatchPerformanceDto } from './dto/create-match-performance.dto';
import { UpdateMatchPerformanceDto } from './dto/update-match-performance.dto';

@Injectable()
export class MatchPerformanceService {
  create(createMatchPerformanceDto: CreateMatchPerformanceDto) {
    return 'This action adds a new matchPerformance';
  }

  findAll() {
    return `This action returns all matchPerformance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} matchPerformance`;
  }

  update(id: number, updateMatchPerformanceDto: UpdateMatchPerformanceDto) {
    return `This action updates a #${id} matchPerformance`;
  }

  remove(id: number) {
    return `This action removes a #${id} matchPerformance`;
  }
}
