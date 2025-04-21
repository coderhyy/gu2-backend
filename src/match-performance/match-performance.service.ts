import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchPerformanceDto } from './dto/create-match-performance.dto';
import { UpdateMatchPerformanceDto } from './dto/update-match-performance.dto';
import { MatchPerformance } from './entities/match-performance.entity';
import { Player } from '../players/entities/player.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class MatchPerformanceService {
  constructor(
    @InjectRepository(MatchPerformance)
    private matchPerformanceRepository: Repository<MatchPerformance>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createMatchPerformanceDto: CreateMatchPerformanceDto) {
    // 检查球员是否存在
    const player = await this.playerRepository.findOne({
      where: { player_id: createMatchPerformanceDto.player_id },
    });

    if (!player) {
      throw new NotFoundException(
        `Player with id ${createMatchPerformanceDto.player_id} not found`,
      );
    }

    // 检查赛事是否存在
    const event = await this.eventRepository.findOne({
      where: { event_id: createMatchPerformanceDto.event_id },
    });

    if (!event) {
      throw new NotFoundException(
        `Event with id ${createMatchPerformanceDto.event_id} not found`,
      );
    }

    // 创建新的比赛表现记录
    const performance = this.matchPerformanceRepository.create({
      ...createMatchPerformanceDto,
      player,
      event,
    });

    // 保存记录
    await this.matchPerformanceRepository.save(performance);

    return {
      message: 'Match performance record created successfully',
      data: performance,
    };
  }

  async findAll() {
    const performances = await this.matchPerformanceRepository.find({
      relations: ['player', 'event'],
    });

    return {
      message: 'Get all match performance records successfully',
      data: performances,
    };
  }

  async findByPlayer(playerId: number) {
    const player = await this.playerRepository.findOne({
      where: { player_id: playerId },
    });

    if (!player) {
      throw new NotFoundException(`Player with id ${playerId} not found`);
    }

    const performances = await this.matchPerformanceRepository.find({
      where: { player: { player_id: playerId } },
      relations: ['player', 'event'],
      order: { recorded_at: 'DESC' },
    });

    return {
      message: `Get match performance records for player with id ${playerId} successfully`,
      data: performances,
    };
  }

  async findByEvent(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { event_id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const performances = await this.matchPerformanceRepository.find({
      where: { event: { event_id: eventId } },
      relations: ['player', 'event'],
    });

    return {
      message: `Get match performance records for event with id ${eventId} successfully`,
      data: performances,
    };
  }

  async findOne(id: number) {
    const performance = await this.matchPerformanceRepository.findOne({
      where: { performance_id: id },
      relations: ['player', 'event'],
    });

    if (!performance) {
      throw new NotFoundException(
        `Match performance record with id ${id} not found`,
      );
    }

    return {
      message: 'Get match performance record successfully',
      data: performance,
    };
  }

  async update(
    id: number,
    updateMatchPerformanceDto: UpdateMatchPerformanceDto,
  ) {
    const performance = await this.matchPerformanceRepository.findOne({
      where: { performance_id: id },
    });

    if (!performance) {
      throw new NotFoundException(
        `Match performance record with id ${id} not found`,
      );
    }

    // 更新记录
    await this.matchPerformanceRepository.update(id, updateMatchPerformanceDto);

    // 获取更新后的记录
    const updatedPerformance = await this.matchPerformanceRepository.findOne({
      where: { performance_id: id },
      relations: ['player', 'event'],
    });

    return {
      message: 'Match performance record updated successfully',
      data: updatedPerformance,
    };
  }

  async remove(id: number) {
    const performance = await this.matchPerformanceRepository.findOne({
      where: { performance_id: id },
      relations: ['player', 'event'],
    });

    if (!performance) {
      throw new NotFoundException(
        `Match performance record with id ${id} not found`,
      );
    }

    await this.matchPerformanceRepository.remove(performance);

    return {
      message: 'Match performance record deleted successfully',
      data: performance,
    };
  }
}
