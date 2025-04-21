// src/events/events.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Player } from '../players/entities/player.entity';
import { Coach } from '../coaches/entities/coach.entity';
import { Member } from '../members/entities/member.entity';
import { Team } from '../teams/entities/team.entity';
import { GameRule } from '../game-rules/entities/game-rule.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(GameRule)
    private rulesRepository: Repository<GameRule>,
  ) {}

  async createCompetition(createEventDto: CreateEventDto) {
    // 创建赛事基本信息
    const event = new Event();
    event.event_name = createEventDto.event_name;
    event.event_date = new Date(createEventDto.event_date);
    event.event_location = createEventDto.event_location;
    event.event_description = createEventDto.event_description;
    event.teams_involved = createEventDto.teams_involved;
    event.results = createEventDto.results || '';
    event.status = createEventDto.status || EventStatus.DRAFT;

    // 设置创建人
    const creator = await this.membersRepository.findOne({
      where: { member_id: createEventDto.created_by },
    });

    if (!creator) {
      throw new NotFoundException(
        `Member with ID ${createEventDto.created_by} not found`,
      );
    }
    event.created_by = creator;

    // 如果有参与者，添加参与者
    if (
      createEventDto.participant_ids &&
      createEventDto.participant_ids.length > 0
    ) {
      const players = await this.playersRepository.findBy({
        player_id: In(createEventDto.participant_ids),
      });

      if (players.length !== createEventDto.participant_ids.length) {
        throw new BadRequestException('Some participant IDs are invalid');
      }

      event.participants = players;
    }

    // 如果有教练，添加教练
    if (createEventDto.coach_ids && createEventDto.coach_ids.length > 0) {
      const coaches = await this.coachesRepository.findBy({
        coach_id: In(createEventDto.coach_ids),
      });

      if (coaches.length !== createEventDto.coach_ids.length) {
        throw new BadRequestException('Some coach IDs are invalid');
      }

      event.coaches = coaches;
    }

    // 如果有队伍，添加队伍
    if (createEventDto.team_ids && createEventDto.team_ids.length > 0) {
      const teams = await this.teamsRepository.findBy({
        team_id: In(createEventDto.team_ids),
      });

      if (teams.length !== createEventDto.team_ids.length) {
        throw new BadRequestException('Some team IDs are invalid');
      }

      event.teams = teams;
    }

    // 如果有规则，添加规则
    if (createEventDto.rule_ids && createEventDto.rule_ids.length > 0) {
      const rules = await this.rulesRepository.findBy({
        rule_id: In(createEventDto.rule_ids),
      });

      if (rules.length !== createEventDto.rule_ids.length) {
        throw new BadRequestException('Some rule IDs are invalid');
      }

      event.rules = rules;
    }

    return this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['participants', 'coaches', 'created_by', 'teams', 'rules'],
    });
  }

  async findAllPublished(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { status: EventStatus.PUBLISHED },
      relations: ['participants', 'coaches', 'teams', 'rules'],
    });
  }

  async queryCompetitionDetails(id: number) {
    const event = await this.eventsRepository.findOne({
      where: { event_id: id },
      relations: ['participants', 'coaches', 'created_by', 'teams', 'rules'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async updateCompetitionInfo(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.queryCompetitionDetails(id);

    // 更新基本信息
    if (updateEventDto.event_name) event.event_name = updateEventDto.event_name;
    if (updateEventDto.event_date)
      event.event_date = new Date(updateEventDto.event_date);
    if (updateEventDto.event_location)
      event.event_location = updateEventDto.event_location;
    if (updateEventDto.event_description)
      event.event_description = updateEventDto.event_description;
    if (updateEventDto.status) event.status = updateEventDto.status;
    if (updateEventDto.teams_involved)
      event.teams_involved = updateEventDto.teams_involved;
    if (updateEventDto.results) event.results = updateEventDto.results;

    // 如果状态变为已发布且之前未发布，设置发布时间
    if (
      updateEventDto.status === EventStatus.PUBLISHED &&
      event.status !== EventStatus.PUBLISHED
    ) {
      event.published_at = new Date();
    }

    // 更新参与者
    if (updateEventDto.participant_ids) {
      const players = await this.playersRepository.findBy({
        player_id: In(updateEventDto.participant_ids),
      });

      if (players.length !== updateEventDto.participant_ids.length) {
        throw new BadRequestException('Some participant IDs are invalid');
      }

      event.participants = players;
    }

    // 更新教练
    if (updateEventDto.coach_ids) {
      const coaches = await this.coachesRepository.findBy({
        coach_id: In(updateEventDto.coach_ids),
      });

      if (coaches.length !== updateEventDto.coach_ids.length) {
        throw new BadRequestException('Some coach IDs are invalid');
      }

      event.coaches = coaches;
    }

    // 更新关联队伍
    if (updateEventDto.team_ids) {
      const teams = await this.teamsRepository.findBy({
        team_id: In(updateEventDto.team_ids),
      });

      if (teams.length !== updateEventDto.team_ids.length) {
        throw new BadRequestException('Some team IDs are invalid');
      }

      event.teams = teams;
    }

    // 更新游戏规则
    if (updateEventDto.rule_ids) {
      const rules = await this.rulesRepository.findBy({
        rule_id: In(updateEventDto.rule_ids),
      });

      if (rules.length !== updateEventDto.rule_ids.length) {
        throw new BadRequestException('Some rule IDs are invalid');
      }

      event.rules = rules;
    }

    return this.eventsRepository.save(event);
  }

  async publishEvent(id: number) {
    const event = await this.queryCompetitionDetails(id);

    event.status = EventStatus.PUBLISHED;
    event.published_at = new Date();

    return this.eventsRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.queryCompetitionDetails(id);
    return this.eventsRepository.remove(event);
  }
}
