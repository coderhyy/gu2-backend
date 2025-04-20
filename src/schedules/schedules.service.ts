import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleItem } from './entities/schedule-item.entity';
import { Event } from '../events/entities/event.entity';
import { Team } from '../teams/entities/team.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @InjectRepository(ScheduleItem)
    private scheduleItemRepository: Repository<ScheduleItem>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private eventsService: EventsService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    // 确保事件存在
    if (createScheduleDto.event_id) {
      const event = await this.eventsService.queryCompetitionDetails(createScheduleDto.event_id);
      if (!event) {
        throw new NotFoundException(`事件ID ${createScheduleDto.event_id} 不存在`);
      }
    }

    const schedule = this.schedulesRepository.create(createScheduleDto);
    return this.schedulesRepository.save(schedule);
  }

  findAll(): Promise<Schedule[]> {
    return this.schedulesRepository.find({
      relations: ['event'],
    });
  }

  findByEvent(eventId: number): Promise<Schedule[]> {
    return this.schedulesRepository.find({
      where: { event: { event_id: eventId } },
      relations: ['event'],
    });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOne({
      where: { schedule_id: id },
      relations: ['event'],
    });
    
    if (!schedule) {
      throw new NotFoundException(`日程ID ${id} 不存在`);
    }
    
    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    // 确保日程存在
    const schedule = await this.findOne(id);
    
    // 确保事件存在
    if (updateScheduleDto.event_id) {
      const event = await this.eventsService.queryCompetitionDetails(updateScheduleDto.event_id);
      if (!event) {
        throw new NotFoundException(`事件ID ${updateScheduleDto.event_id} 不存在`);
      }
    }
    
    // 使用深度合并而不是直接更新
    const updatedSchedule = { ...schedule } as Schedule;
    
    // 更新基本字段
    if (updateScheduleDto.title) updatedSchedule.title = updateScheduleDto.title;
    if (updateScheduleDto.description !== undefined) updatedSchedule.description = updateScheduleDto.description;
    if (updateScheduleDto.is_published !== undefined) updatedSchedule.is_published = updateScheduleDto.is_published;
    if (updateScheduleDto.event_id) {
      updatedSchedule.event = { event_id: updateScheduleDto.event_id } as Event;
    }
    
    await this.schedulesRepository.save(updatedSchedule);
    
    // 如果有新的items数据，先删除原有的，再创建新的
    if (updateScheduleDto.items && updateScheduleDto.items.length > 0) {
      // 删除原有的items
      await this.scheduleItemRepository.delete({ schedule: { schedule_id: id } as any });
      
      // 创建新的items
      for (const itemDto of updateScheduleDto.items) {
        const item = this.scheduleItemRepository.create(itemDto);
        (item as any).schedule = updatedSchedule;
        await this.scheduleItemRepository.save(item);
      }
    }
    
    return this.findOne(id);
  }

  async publish(id: number, userId: number): Promise<Schedule> {
    const schedule = await this.findOne(id);
    schedule.is_published = true;
    schedule.published_by = userId;
    schedule.published_at = new Date();
    
    return this.schedulesRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const schedule = await this.findOne(id);
    await this.schedulesRepository.remove(schedule);
  }
} 