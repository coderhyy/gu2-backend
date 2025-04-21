import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsentFormDto } from './dto/create-consent-form.dto';
import { UpdateConsentFormDto } from './dto/update-consent-form.dto';
import { ConsentForm } from './entities/consent-form.entity';
import { Player } from '../players/entities/player.entity';
import { MemberType } from '../auth/role.enum';

@Injectable()
export class ConsentFormsService {
  constructor(
    @InjectRepository(ConsentForm)
    private consentFormRepository: Repository<ConsentForm>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(
    createConsentFormDto: CreateConsentFormDto,
  ): Promise<ConsentForm> {
    // 检查玩家是否存在
    const player = await this.playerRepository.findOne({
      where: { player_id: createConsentFormDto.player_id },
      relations: ['member'],
    });

    if (!player) {
      throw new NotFoundException(
        `Player with id ${createConsentFormDto.player_id} not found`,
      );
    }

    // 创建并保存同意书
    const consentForm = this.consentFormRepository.create({
      ...createConsentFormDto,
      player,
    });

    return this.consentFormRepository.save(consentForm);
  }

  async findAll(
    userId?: number,
    userRole?: MemberType,
  ): Promise<ConsentForm[]> {
    // 如果是ADMIN、COACH或CHAIRMAN，返回所有同意书
    if (
      userRole === MemberType.ADMIN ||
      userRole === MemberType.COACH ||
      userRole === MemberType.CHAIRMAN
    ) {
      return this.consentFormRepository.find({
        relations: ['player', 'player.member'],
      });
    }

    // 如果是PLAYER，需要找到对应的player_id
    if (userRole === MemberType.PLAYER && userId) {
      // 先找到用户对应的球员记录
      const player = await this.playerRepository.findOne({
        where: { member: { member_id: userId } },
      });

      if (player) {
        return this.consentFormRepository.find({
          where: { player: { player_id: player.player_id } },
          relations: ['player', 'player.member'],
        });
      }
    }

    // 如果没有找到对应的球员记录或者没有提供userId，返回空数组
    return [];
  }

  async findByPlayer(playerId: number): Promise<ConsentForm[]> {
    const forms = await this.consentFormRepository.find({
      where: { player: { player_id: playerId } },
      relations: ['player', 'player.member'],
    });

    return forms;
  }

  async findOne(
    id: number,
    userId?: number,
    userRole?: MemberType,
  ): Promise<ConsentForm> {
    const consentForm = await this.consentFormRepository.findOne({
      where: { consent_id: id },
      relations: ['player', 'player.member'],
    });

    if (!consentForm) {
      throw new NotFoundException(`Consent form with id ${id} not found`);
    }

    // 如果是ADMIN、COACH或CHAIRMAN，直接返回
    if (
      userRole === MemberType.ADMIN ||
      userRole === MemberType.COACH ||
      userRole === MemberType.CHAIRMAN
    ) {
      return consentForm;
    }

    // 如果是PLAYER，检查是否是自己的同意书
    if (userRole === MemberType.PLAYER && userId) {
      if (consentForm.player.member.member_id !== userId) {
        throw new ForbiddenException(
          'You do not have permission to view other members consent forms',
        );
      }
    }

    return consentForm;
  }

  async update(
    id: number,
    updateConsentFormDto: UpdateConsentFormDto,
    userId?: number,
    userRole?: MemberType,
  ): Promise<ConsentForm> {
    const consentForm = await this.findOne(id, userId, userRole);

    // 权限检查已在findOne方法中完成
    const player = await this.playerRepository.findOne({
      where: { player_id: updateConsentFormDto.player_id },
    });

    if (!player) {
      throw new NotFoundException(
        `Player with id ${updateConsentFormDto.player_id} not found`,
      );
    }

    // 更新同意书
    this.consentFormRepository.merge(consentForm, updateConsentFormDto);
    consentForm.player = player;

    return this.consentFormRepository.save(consentForm);
  }

  async remove(
    id: number,
    userId?: number,
    userRole?: MemberType,
  ): Promise<void> {
    const consentForm = await this.findOne(id, userId, userRole);

    // 只有管理员或主席才能删除同意书
    if (userRole !== MemberType.ADMIN && userRole !== MemberType.CHAIRMAN) {
      throw new ForbiddenException(
        'Only admins or chairmen can delete consent forms',
      );
    }

    await this.consentFormRepository.remove(consentForm);
  }
}
