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
      message: '游戏规则创建成功',
      data: gameRule
    };
  }

  async findAll() {
    const gameRules = await this.gameRuleRepository.find({
      order: {
        category: 'ASC',
        rule_name: 'ASC'
      }
    });
    
    return {
      message: '获取所有游戏规则成功',
      data: gameRules
    };
  }

  async findByCategory(category: string) {
    const gameRules = await this.gameRuleRepository.find({
      where: { category },
      order: {
        rule_name: 'ASC'
      }
    });
    
    return {
      message: `获取类别为 ${category} 的游戏规则成功`,
      data: gameRules
    };
  }

  async findOne(id: number) {
    const gameRule = await this.gameRuleRepository.findOne({
      where: { rule_id: id },
      relations: ['events']
    });
    
    if (!gameRule) {
      throw new NotFoundException(`ID 为 ${id} 的游戏规则不存在`);
    }
    
    return {
      message: '获取游戏规则成功',
      data: gameRule
    };
  }

  async update(id: number, updateGameRuleDto: UpdateGameRuleDto) {
    const gameRule = await this.gameRuleRepository.findOne({
      where: { rule_id: id }
    });
    
    if (!gameRule) {
      throw new NotFoundException(`ID 为 ${id} 的游戏规则不存在`);
    }
    
    this.gameRuleRepository.merge(gameRule, updateGameRuleDto);
    await this.gameRuleRepository.save(gameRule);
    
    return {
      message: '游戏规则更新成功',
      data: gameRule
    };
  }

  async remove(id: number) {
    const gameRule = await this.gameRuleRepository.findOne({
      where: { rule_id: id }
    });
    
    if (!gameRule) {
      throw new NotFoundException(`ID 为 ${id} 的游戏规则不存在`);
    }
    
    await this.gameRuleRepository.remove(gameRule);
    
    return {
      message: '游戏规则删除成功',
      data: { id }
    };
  }
} 