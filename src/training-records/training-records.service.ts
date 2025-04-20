import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrainingRecordDto } from './dto/create-training-record.dto';
import { UpdateTrainingRecordDto } from './dto/update-training-record.dto';
import { TrainingRecord } from './entities/training-record.entity';
import { Player } from '../players/entities/player.entity';
import { Training } from '../trainings/entities/training.entity';

@Injectable()
export class TrainingRecordsService {
  constructor(
    @InjectRepository(TrainingRecord)
    private trainingRecordRepository: Repository<TrainingRecord>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
  ) {}

  async create(createTrainingRecordDto: CreateTrainingRecordDto) {
    // 检查球员是否存在
    const player = await this.playerRepository.findOne({ 
      where: { player_id: createTrainingRecordDto.player_id } 
    });
    
    if (!player) {
      throw new NotFoundException(`球员ID ${createTrainingRecordDto.player_id} 不存在`);
    }
    
    // 检查训练是否存在
    const training = await this.trainingRepository.findOne({ 
      where: { training_id: createTrainingRecordDto.training_id } 
    });
    
    if (!training) {
      throw new NotFoundException(`训练ID ${createTrainingRecordDto.training_id} 不存在`);
    }
    
    // 创建新的训练记录
    const record = this.trainingRecordRepository.create({
      ...createTrainingRecordDto,
      player,
      training,
    });
    
    // 保存记录
    await this.trainingRecordRepository.save(record);
    
    return {
      message: '训练记录创建成功',
      data: record
    };
  }

  async findAll() {
    const records = await this.trainingRecordRepository.find({
      relations: ['player', 'training', 'training.coach'],
    });
    
    return {
      message: '获取所有训练记录成功',
      data: records
    };
  }

  async findByPlayer(playerId: number) {
    const player = await this.playerRepository.findOne({ 
      where: { player_id: playerId } 
    });
    
    if (!player) {
      throw new NotFoundException(`球员ID ${playerId} 不存在`);
    }
    
    const records = await this.trainingRecordRepository.find({
      where: { player: { player_id: playerId } },
      relations: ['player', 'training', 'training.coach'],
      order: { created_at: 'DESC' }
    });
    
    return {
      message: `获取球员ID ${playerId} 的训练记录成功`,
      data: records
    };
  }

  async findOne(id: number) {
    const record = await this.trainingRecordRepository.findOne({ 
      where: { record_id: id },
      relations: ['player', 'training', 'training.coach'] 
    });
    
    if (!record) {
      throw new NotFoundException(`训练记录ID ${id} 不存在`);
    }
    
    return {
      message: '获取训练记录成功',
      data: record
    };
  }

  async update(id: number, updateTrainingRecordDto: UpdateTrainingRecordDto) {
    const record = await this.trainingRecordRepository.findOne({ 
      where: { record_id: id } 
    });
    
    if (!record) {
      throw new NotFoundException(`训练记录ID ${id} 不存在`);
    }
    
    // 更新记录
    await this.trainingRecordRepository.update(id, updateTrainingRecordDto);
    
    // 获取更新后的记录
    const updatedRecord = await this.trainingRecordRepository.findOne({ 
      where: { record_id: id },
      relations: ['player', 'training', 'training.coach'] 
    });
    
    return {
      message: '训练记录更新成功',
      data: updatedRecord
    };
  }

  async remove(id: number) {
    const record = await this.trainingRecordRepository.findOne({ 
      where: { record_id: id },
      relations: ['player', 'training'] 
    });
    
    if (!record) {
      throw new NotFoundException(`训练记录ID ${id} 不存在`);
    }
    
    await this.trainingRecordRepository.remove(record);
    
    return {
      message: '训练记录删除成功',
      data: record
    };
  }
}
