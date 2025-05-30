import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { Training } from './entities/training.entity';
import { Coach } from '../coaches/entities/coach.entity';
import { Player } from '../players/entities/player.entity';
import { TrainingRecord } from '../training-records/entities/training-record.entity';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(TrainingRecord)
    private trainingRecordRepository: Repository<TrainingRecord>,
    private dataSource: DataSource,
  ) {}

  async create(createTrainingDto: CreateTrainingDto) {
    const { coach_id, player_ids, ...trainingData } = createTrainingDto;

    // 查找教练
    const coach = await this.coachRepository.findOne({ where: { coach_id } });
    if (!coach) {
      throw new NotFoundException(`Coach with id ${coach_id} not found`);
    }

    // 查找球员
    const players = await this.playerRepository.findBy({
      player_id: In(player_ids),
    });
    if (players.length !== player_ids.length) {
      throw new BadRequestException('Some player IDs do not exist');
    }

    // 使用事务来确保数据一致性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 创建训练计划
      const training = this.trainingRepository.create({
        ...trainingData,
        coach,
      });

      await queryRunner.manager.save(training);

      // 创建训练记录（记录哪些球员参加训练）
      for (const player of players) {
        const trainingRecord = this.trainingRecordRepository.create({
          player,
          training,
          performance: '', // Initial empty, will be filled after training
        });
        await queryRunner.manager.save(trainingRecord);
      }

      await queryRunner.commitTransaction();
      return training;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(args: { page: number; size: number }) {
    const { page = 1, size = 10 } = args;
    const [trainings, total] = await this.trainingRepository.findAndCount({
      relations: ['coach', 'training_records', 'training_records.player'],
      skip: (page - 1) * size,
      take: size,
    });
    return {
      data: trainings,
      total,
    };
  }

  async findOne(id: number) {
    const training = await this.trainingRepository.findOne({
      where: { training_id: id },
      relations: ['coach', 'training_records', 'training_records.player'],
    });

    if (!training) {
      throw new NotFoundException(`Training plan with id ${id} not found`);
    }

    return training;
  }

  async findByCoach(coachId: number) {
    return this.trainingRepository.find({
      where: { coach: { coach_id: coachId } },
      relations: ['training_records', 'training_records.player'],
    });
  }

  async update(id: number, updateTrainingDto: UpdateTrainingDto) {
    const training = await this.findOne(id);

    // 更新训练信息
    Object.assign(training, updateTrainingDto);

    return this.trainingRepository.save(training);
  }

  async remove(id: number) {
    // 使用事务确保数据一致性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 先删除关联的训练记录
      await this.trainingRecordRepository.delete({
        training: { training_id: id },
      });

      // 然后删除训练
      const training = await this.findOne(id);
      const result = await this.trainingRepository.remove(training);

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      // 如果出错，回滚事务
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }
}
