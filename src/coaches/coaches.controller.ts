// src/coaches/coaches.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { AddPlayerProfileDto } from './dto/add-player-profile.dto';
import { TrainingPlanDto } from './dto/training-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('coaches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  @Roles('admin')
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Get()
  findAll() {
    return this.coachesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Patch(':id')
  @Roles('coach', 'admin')
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @Post(':id/player-profile')
  @Roles('coach')
  addPlayerProfile(
    @Param('id') id: string,
    @Body() playerData: AddPlayerProfileDto,
  ) {
    return this.coachesService.addPlayerProfile(id, playerData);
  }

  @Post(':id/training-plan')
  @Roles('coach')
  editTrainingPlan(
    @Param('id') id: string,
    @Body() trainingPlan: TrainingPlanDto,
  ) {
    return this.coachesService.editTrainingPlan(id, trainingPlan);
  }

  @Get(':id/players')
  @Roles('coach', 'admin')
  viewPlayerList(@Param('id') id: string) {
    return this.coachesService.viewPlayerList(id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.coachesService.remove(id);
  }
}
