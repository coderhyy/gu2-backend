// src/players/players.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { TrainingRecordDto } from './dto/training-record.dto';
import { MatchPerformanceDto } from './dto/match-performance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PlayerPaginationDto } from './dto/player-pagination.dto';

@Controller('players')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles('admin', 'coach')
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  findAll(@Query() paginationDto: PlayerPaginationDto) {
    return this.playersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @Roles('player', 'coach', 'admin')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Post(':id/training')
  @Roles('player', 'coach')
  recordTraining(
    @Param('id') id: string,
    @Body() trainingData: TrainingRecordDto,
  ) {
    // return this.playersService.recordTraining(id, trainingData);
  }

  @Post(':id/match-performance')
  @Roles('coach')
  updateMatchPerformance(
    @Param('id') id: string,
    @Body() performanceData: MatchPerformanceDto,
  ) {
    // return this.playersService.updateMatchPerformance(id, performanceData);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.playersService.remove(id);
  }
}
