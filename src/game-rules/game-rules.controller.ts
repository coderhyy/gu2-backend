import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Query
} from '@nestjs/common';
import { GameRulesService } from './game-rules.service';
import { CreateGameRuleDto } from './dto/create-game-rule.dto';
import { UpdateGameRuleDto } from './dto/update-game-rule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MemberType } from '../auth/role.enum';

@Controller('game-rules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GameRulesController {
  constructor(private readonly gameRulesService: GameRulesService) {}

  @Post()
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  create(@Body() createGameRuleDto: CreateGameRuleDto) {
    return this.gameRulesService.create(createGameRuleDto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.gameRulesService.findByCategory(category);
    }
    return this.gameRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameRulesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(MemberType.ADMIN, MemberType.EVENT_ASSISTANT, MemberType.CHAIRMAN)
  update(@Param('id') id: string, @Body() updateGameRuleDto: UpdateGameRuleDto) {
    return this.gameRulesService.update(+id, updateGameRuleDto);
  }

  @Delete(':id')
  @Roles(MemberType.ADMIN, MemberType.CHAIRMAN)
  remove(@Param('id') id: string) {
    return this.gameRulesService.remove(+id);
  }
} 