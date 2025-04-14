// src/members/members.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async register(createMemberDto: CreateMemberDto): Promise<Member> {
    const { email } = createMemberDto;
    const existing = await this.membersRepository.findOne({ where: { email } });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createMemberDto.password, 10);

    const member = this.membersRepository.create({
      ...createMemberDto,
      password: hashedPassword,
    });

    return this.membersRepository.save(member);
  }

  async findAll(): Promise<Member[]> {
    return this.membersRepository.find();
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.membersRepository.findOne({
      where: { member_id: parseInt(id) },
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async findByEmail(email: string): Promise<Member | null> {
    return this.membersRepository.findOne({ where: { email } });
  }

  async updateInfo(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const member = await this.findOne(id);

    // If password is being updated, hash it
    if (updateMemberDto.password) {
      updateMemberDto.password = await bcrypt.hash(
        updateMemberDto.password,
        10,
      );
    }

    const updated = this.membersRepository.merge(member, updateMemberDto);
    return this.membersRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.membersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }
}
