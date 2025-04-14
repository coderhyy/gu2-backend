import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchPerformanceDto } from './create-match-performance.dto';

export class UpdateMatchPerformanceDto extends PartialType(CreateMatchPerformanceDto) {}
