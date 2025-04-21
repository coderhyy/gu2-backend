import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameRuleDto } from './dto/create-game-rule.dto';
import { UpdateGameRuleDto } from './dto/update-game-rule.dto';
import { GameRule } from './entities/game-rule.entity';

@Injectable()
export class GameRulesService {
  constructor(
    @InjectRepository(GameRule)
    private gameRuleRepository: Repository<GameRule>,
  ) {}

  async create(createGameRuleDto: CreateGameRuleDto) {
    const gameRule = this.gameRuleRepository.create(createGameRuleDto);
    await this.gameRuleRepository.save(gameRule);

    return {
      message: 'Game rule created successfully',
      data: gameRule,
    };
  }

  async findAll() {
    const gameRules = await this.gameRuleRepository.find({
      order: {
        category: 'ASC',
        rule_name: 'ASC',
      },
    });

    return {
      message: 'Get all game rules successfully',
      data: gameRules,
    };
  }

  async findByCategory(category: string) {
    const gameRules = await this.gameRuleRepository.find({
      where: { category },
      order: {
        rule_name: 'ASC',
      },
    });

    return {
      message: `Get game rules with category ${category} successfully`,
      data: gameRules,
    };
  }

  async findOne(id: number) {
    const gameRule = await this.gameRuleRepository.findOne({
      where: { rule_id: id },
      relations: ['events'],
    });

    if (!gameRule) {
      throw new NotFoundException(`Game rule with id ${id} not found`);
    }

    return {
      message: 'Get game rule successfully',
      data: gameRule,
    };
  }

  async update(id: number, updateGameRuleDto: UpdateGameRuleDto) {
    const gameRule = await this.gameRuleRepository.findOne({
      where: { rule_id: id },
    });

    if (!gameRule) {
      throw new NotFoundException(`Game rule with id ${id} not found`);
    }

    this.gameRuleRepository.merge(gameRule, updateGameRuleDto);
    await this.gameRuleRepository.save(gameRule);

    return {
      message: 'Game rule updated successfully',
      data: gameRule,
    };
  }

  async remove(id: number) {
    const gameRule = await this.gameRuleRepository.findOne({
      where: { rule_id: id },
    });

    if (!gameRule) {
      throw new NotFoundException(`Game rule with id ${id} not found`);
    }

    await this.gameRuleRepository.remove(gameRule);

    return {
      message: 'Game rule deleted successfully',
      data: { id },
    };
  }
}
