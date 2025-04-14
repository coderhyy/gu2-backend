import { Test, TestingModule } from '@nestjs/testing';
import { MatchPerformanceService } from './match-performance.service';

describe('MatchPerformanceService', () => {
  let service: MatchPerformanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchPerformanceService],
    }).compile();

    service = module.get<MatchPerformanceService>(MatchPerformanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
