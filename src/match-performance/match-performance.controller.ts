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
  UnauthorizedException
} from '@nestjs/common';
import { MatchPerformanceService } from './match-performance.service';
import { CreateMatchPerformanceDto } from './dto/create-match-performance.dto';
import { UpdateMatchPerformanceDto } from './dto/update-match-performance.dto';
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

@Controller('match-performance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchPerformanceController {
  constructor(private readonly matchPerformanceService: MatchPerformanceService) {}

  @Post()
  @Roles(MemberType.ADMIN, MemberType.COACH)
  create(@Body() createMatchPerformanceDto: CreateMatchPerformanceDto, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    
    return this.matchPerformanceService.create(createMatchPerformanceDto);
  }

  @Get()
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN)
  findAll() {
    return this.matchPerformanceService.findAll();
  }

  @Get('player/:playerId')
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN, MemberType.PLAYER)
  findByPlayer(@Param('playerId') playerId: string) {
    return this.matchPerformanceService.findByPlayer(+playerId);
  }

  @Get('event/:eventId')
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN)
  findByEvent(@Param('eventId') eventId: string) {
    return this.matchPerformanceService.findByEvent(+eventId);
  }

  @Get(':id')
  @Roles(MemberType.ADMIN, MemberType.COACH, MemberType.CHAIRMAN, MemberType.PLAYER)
  findOne(@Param('id') id: string) {
    return this.matchPerformanceService.findOne(+id);
  }

  @Patch(':id')
  @Roles(MemberType.ADMIN, MemberType.COACH)
  update(
    @Param('id') id: string, 
    @Body() updateMatchPerformanceDto: UpdateMatchPerformanceDto,
    @Req() req: RequestWithUser
  ) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    
    return this.matchPerformanceService.update(+id, updateMatchPerformanceDto);
  }

  @Delete(':id')
  @Roles(MemberType.ADMIN, MemberType.COACH)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('用户未认证');
    }
    
    return this.matchPerformanceService.remove(+id);
  }
}
