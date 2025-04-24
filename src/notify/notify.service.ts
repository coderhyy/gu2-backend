import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { UpdateNotifyDto } from './dto/update-notify.dto';
import { Notify } from './entities/notify.entity';
import { Coach } from '../coaches/entities/coach.entity';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class NotifyService {
  constructor(
    @InjectRepository(Notify)
    private notifyRepository: Repository<Notify>,
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(createNotifyDto: CreateNotifyDto) {
    const { sender_id, player_id, team_id, is_team_notification } =
      createNotifyDto;

    // 查找发送者（教练）
    const coach = await this.coachRepository.findOne({
      where: { coach_id: sender_id },
    });
    if (!coach) {
      throw new NotFoundException(`教练ID ${sender_id} 不存在`);
    }

    const notification = new Notify();
    notification.title = createNotifyDto.title;
    notification.content = createNotifyDto.content;
    notification.sender = coach;
    notification.is_team_notification = is_team_notification;

    // 根据通知类型设置接收者
    if (is_team_notification) {
      if (!team_id) {
        throw new BadRequestException('团队通知必须指定团队ID');
      }

      const team = await this.teamRepository.findOne({ where: { team_id } });
      if (!team) {
        throw new NotFoundException(`团队ID ${team_id} 不存在`);
      }

      notification.team = team;
    } else {
      if (!player_id) {
        throw new BadRequestException('个人通知必须指定队员ID');
      }

      const player = await this.playerRepository.findOne({
        where: { player_id },
      });
      if (!player) {
        throw new NotFoundException(`队员ID ${player_id} 不存在`);
      }

      notification.player = player;
    }

    return this.notifyRepository.save(notification);
  }

  async findAll() {
    return this.notifyRepository.find({
      relations: ['sender', 'player', 'team'],
    });
  }

  async findByCoach(coachId: number) {
    return this.notifyRepository.find({
      where: { sender: { coach_id: coachId } },
      relations: ['sender', 'player', 'team'],
    });
  }

  async findByPlayer(playerId: number) {
    return this.notifyRepository.find({
      where: [
        { player: { player_id: playerId } },
        { team: { players: { player_id: playerId } } },
      ],
      relations: ['sender', 'player', 'team'],
    });
  }

  async findByTeam(teamId: number) {
    return this.notifyRepository.find({
      where: { team: { team_id: teamId } },
      relations: ['sender', 'player', 'team'],
    });
  }

  async findOne(id: number) {
    const notification = await this.notifyRepository.findOne({
      where: { notification_id: id },
      relations: ['sender', 'player', 'team'],
    });

    if (!notification) {
      throw new NotFoundException(`通知ID ${id} 不存在`);
    }

    return notification;
  }

  async markAsRead(id: number) {
    const notification = await this.findOne(id);
    notification.is_read = true;
    return this.notifyRepository.save(notification);
  }

  async update(id: number, updateNotifyDto: UpdateNotifyDto) {
    const team = await this.teamRepository.findOne({
      where: { team_id: updateNotifyDto.team_id },
    });

    if (!team) {
      throw new NotFoundException(`team ${updateNotifyDto.team_id} not found`);
    }

    const notification = await this.findOne(id);
    Object.assign(notification, updateNotifyDto);
    notification.team = team;
    return this.notifyRepository.save(notification);
  }

  async remove(id: number) {
    const notification = await this.findOne(id);
    return this.notifyRepository.remove(notification);
  }
}
