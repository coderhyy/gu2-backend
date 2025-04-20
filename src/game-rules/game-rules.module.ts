import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRulesService } from './game-rules.service';
import { GameRulesController } from './game-rules.controller';
import { GameRule } from './entities/game-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameRule])],
  controllers: [GameRulesController],
  providers: [GameRulesService],
  exports: [GameRulesService],
})
export class GameRulesModule {} 