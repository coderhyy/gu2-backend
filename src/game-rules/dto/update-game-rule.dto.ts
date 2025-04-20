import { PartialType } from '@nestjs/mapped-types';
import { CreateGameRuleDto } from './create-game-rule.dto';

export class UpdateGameRuleDto extends PartialType(CreateGameRuleDto) {} 