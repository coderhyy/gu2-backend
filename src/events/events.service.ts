// src/events/events.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Player } from '../players/entities/player.entity';
import { Coach } from '../coaches/entities/coach.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
  ) {}

  async createCompetition(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);

    // If participants are specified, load them
    if (
      createEventDto.participantIds &&
      createEventDto.participantIds.length > 0
    ) {
      event.participants = await this.playersRepository.findByIds(
        createEventDto.participantIds,
      );
    }

    // If coaches are specified, load them
    if (createEventDto.coachIds && createEventDto.coachIds.length > 0) {
      event.coaches = await this.coachesRepository.findByIds(
        createEventDto.coachIds,
      );
    }

    return this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['participants', 'coaches'],
    });
  }

  async queryCompetitionDetails(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['participants', 'coaches'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async updateCompetitionInfo(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.queryCompetitionDetails(id);

    // Update basic information
    const updated = this.eventsRepository.merge(event, updateEventDto);

    // Update participants if specified
    if (updateEventDto.participantIds) {
      updated.participants = await this.playersRepository.findByIds(
        updateEventDto.participantIds,
      );
    }

    // Update coaches if specified
    if (updateEventDto.coachIds) {
      updated.coaches = await this.coachesRepository.findByIds(
        updateEventDto.coachIds,
      );
    }

    return this.eventsRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
