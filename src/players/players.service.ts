// src/players/players.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { TrainingRecordDto } from './dto/training-record.dto';
import { MatchPerformanceDto } from './dto/match-performance.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);
    const updated = this.playersRepository.merge(player, updatePlayerDto);
    return this.playersRepository.save(updated);
  }

  async recordTraining(
    id: string,
    trainingData: TrainingRecordDto,
  ): Promise<Player> {
    const player = await this.findOne(id);

    // Update player's game data with training information
    if (!player.gameData) {
      player.gameData = { training: [] };
    }

    if (!player.gameData.training) {
      player.gameData.training = [];
    }

    player.gameData.training.push({
      ...trainingData,
      date: new Date(),
    });

    return this.playersRepository.save(player);
  }

  async updateMatchPerformance(
    id: string,
    performanceData: MatchPerformanceDto,
  ): Promise<Player> {
    const player = await this.findOne(id);

    // Update player's game data with match performance
    if (!player.gameData) {
      player.gameData = { matches: [] };
    }

    if (!player.gameData.matches) {
      player.gameData.matches = [];
    }

    player.gameData.matches.push({
      ...performanceData,
      date: new Date(),
    });

    // Update player statistics
    if (performanceData.goalsScored) {
      player.goalsScored += performanceData.goalsScored;
    }

    if (performanceData.assists) {
      player.assists += performanceData.assists;
    }

    return this.playersRepository.save(player);
  }

  async remove(id: string): Promise<void> {
    const result = await this.playersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
  }
}
