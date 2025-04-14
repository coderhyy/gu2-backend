import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchPerformanceService } from './match-performance.service';
import { CreateMatchPerformanceDto } from './dto/create-match-performance.dto';
import { UpdateMatchPerformanceDto } from './dto/update-match-performance.dto';

@Controller('match-performance')
export class MatchPerformanceController {
  constructor(private readonly matchPerformanceService: MatchPerformanceService) {}

  @Post()
  create(@Body() createMatchPerformanceDto: CreateMatchPerformanceDto) {
    return this.matchPerformanceService.create(createMatchPerformanceDto);
  }

  @Get()
  findAll() {
    return this.matchPerformanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchPerformanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchPerformanceDto: UpdateMatchPerformanceDto) {
    return this.matchPerformanceService.update(+id, updateMatchPerformanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchPerformanceService.remove(+id);
  }
}
