import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { Coach } from '../coaches/entities/coach.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const team = this.teamsRepository.create(createTeamDto);

    // 关联球员（如果提供了球员 ID）
    if (createTeamDto.player_ids && createTeamDto.player_ids.length > 0) {
      const players = await this.playersRepository.findByIds(
        createTeamDto.player_ids,
      );
      team.players = players;
    }

    // 关联教练（如果提供了教练 ID）
    if (createTeamDto.coach_ids && createTeamDto.coach_ids.length > 0) {
      const coaches = await this.coachesRepository.findByIds(
        createTeamDto.coach_ids,
      );
      team.coaches = coaches;
    }

    await this.teamsRepository.save(team);
    return {
      message: 'Team created successfully',
      data: team,
    };
  }

  async findAll() {
    const teams = await this.teamsRepository.find({
      relations: ['players', 'coaches'],
    });
    return {
      message: 'Get all teams successfully',
      data: teams,
    };
  }

  async findOne(id: number) {
    const team = await this.teamsRepository.findOne({
      where: { team_id: id },
      relations: ['players', 'coaches', 'events'],
    });

    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }

    return {
      message: 'Get team successfully',
      data: team,
    };
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamsRepository.findOne({
      where: { team_id: id },
      relations: ['players', 'coaches'],
    });

    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }

    // 更新基本信息
    if (updateTeamDto.team_name) team.team_name = updateTeamDto.team_name;
    if (updateTeamDto.logo_url) team.logo_url = updateTeamDto.logo_url;
    if (updateTeamDto.description) team.description = updateTeamDto.description;
    if (updateTeamDto.founded_year)
      team.founded_year = new Date(updateTeamDto.founded_year);
    if (updateTeamDto.home_venue) team.home_venue = updateTeamDto.home_venue;

    // 更新球员关联
    if (updateTeamDto.player_ids) {
      const players = await this.playersRepository.findByIds(
        updateTeamDto.player_ids,
      );
      team.players = players;
    }

    // 更新教练关联
    if (updateTeamDto.coach_ids) {
      const coaches = await this.coachesRepository.findByIds(
        updateTeamDto.coach_ids,
      );
      team.coaches = coaches;
    }

    await this.teamsRepository.save(team);

    return {
      message: 'Team updated successfully',
      data: team,
    };
  }

  async remove(id: number) {
    const team = await this.teamsRepository.findOne({
      where: { team_id: id },
    });

    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }

    await this.teamsRepository.remove(team);

    return {
      message: 'Team deleted successfully',
      data: { id },
    };
  }
}
