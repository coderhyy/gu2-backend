// src/coaches/coaches.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from './entities/coach.entity';
import { Player } from '../players/entities/player.entity';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { AddPlayerProfileDto } from './dto/add-player-profile.dto';
import { TrainingPlanDto } from './dto/training-plan.dto';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    const coach = this.coachesRepository.create(createCoachDto);
    return this.coachesRepository.save(coach);
  }

  async findAll(): Promise<Coach[]> {
    return this.coachesRepository.find({
      relations: ['member'],
      select: {
        member: {
          name: true,
          email: true,
          phone: true,
          date_of_birth: true,
          registration_date: true,
          member_type: true,
          contact_info: true,
        },
      },
    });
  }

  async findOne(id: string | { member_id: string }): Promise<Coach> {
    let query: Record<string, any>;

    if (typeof id === 'string') {
      query = { coach_id: parseInt(id) };
    } else {
      // 通过关系查询member_id
      query = {
        member: { member_id: parseInt(id.member_id) },
      };
    }

    const coach = await this.coachesRepository.findOne({
      where: query,
      relations: ['member'],
    });

    if (!coach) {
      throw new NotFoundException(`Coach not found`);
    }

    return coach;
  }

  async update(id: string, updateCoachDto: UpdateCoachDto): Promise<Coach> {
    const coach = await this.findOne(id);
    const updated = this.coachesRepository.merge(coach, updateCoachDto);
    return this.coachesRepository.save(updated);
  }

  async addPlayerProfile(
    coachId: string,
    playerData: AddPlayerProfileDto,
  ): Promise<Player> {
    const coach = await this.findOne(coachId);

    const player = await this.playersRepository.findOne({
      where: { player_id: parseInt(playerData.playerId) },
    });

    if (!player) {
      throw new NotFoundException(
        `Player with ID ${playerData.playerId} not found`,
      );
    }

    // Update player profile with coach's notes
    player.team_name = coach.team_name;

    // if (!player.gameData) {
    //   player.gameData = {};
    // }

    // if (!player.gameData.coachNotes) {
    //   player.gameData.coachNotes = [];
    // }

    // player.gameData.coachNotes.push({
    //   coachId: coach.coach_id,
    //   coachName: coach.name,
    //   notes: playerData.notes,
    //   date: new Date(),
    // });

    return this.playersRepository.save(player);
  }

  async editTrainingPlan(
    coachId: string,
    trainingPlan: TrainingPlanDto,
  ): Promise<any> {
    const coach = await this.findOne(coachId);

    // Create or update training plan
    // This could be stored in a separate TrainingPlan entity
    // For simplicity, we'll just return the plan with coach information

    return {
      coachId: coach.coach_id,
      coachName: coach.member.name,
      team: coach.team_name,
      trainingPlan: {
        ...trainingPlan,
        createdAt: new Date(),
      },
    };
  }

  async viewPlayerList(coachId: string): Promise<Player[]> {
    const coach = await this.findOne(coachId);
    return this.playersRepository.find({
      where: { team_name: coach.team_name },
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.coachesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Coach with ID ${id} not found`);
    }
  }
}
