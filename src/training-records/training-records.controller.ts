import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common';
import { TrainingRecordsService } from './training-records.service';
import { CreateTrainingRecordDto } from './dto/create-training-record.dto';
import { UpdateTrainingRecordDto } from './dto/update-training-record.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MemberType } from '../auth/role.enum';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    member_type: MemberType;
    [key: string]: any;
  };
}

@Controller('training-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingRecordsController {
  constructor(private readonly trainingRecordsService: TrainingRecordsService) {}

  @Post()
  @Roles(MemberType.ADMIN, MemberType.COACH)
  create(@Body() createTrainingRecordDto: CreateTrainingRecordDto, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    
    return this.trainingRecordsService.create(createTrainingRecordDto);
  }

  @Get()
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN)
  findAll() {
    return this.trainingRecordsService.findAll();
  }

  @Get('player/:playerId')
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN)
  findByPlayer(@Param('playerId') playerId: string) {
    return this.trainingRecordsService.findByPlayer(+playerId);
  }

  @Get(':id')
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN)
  findOne(@Param('id') id: string) {
    return this.trainingRecordsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(MemberType.ADMIN, MemberType.COACH)
  update(
    @Param('id') id: string, 
    @Body() updateTrainingRecordDto: UpdateTrainingRecordDto,
    @Req() req: RequestWithUser
  ) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    
    return this.trainingRecordsService.update(+id, updateTrainingRecordDto);
  }

  @Delete(':id')
  @Roles(MemberType.ADMIN, MemberType.COACH)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    
    return this.trainingRecordsService.remove(+id);
  }
}
