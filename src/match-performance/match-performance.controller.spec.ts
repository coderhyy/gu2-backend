import { Test, TestingModule } from '@nestjs/testing';
import { MatchPerformanceController } from './match-performance.controller';
import { MatchPerformanceService } from './match-performance.service';

describe('MatchPerformanceController', () => {
  let controller: MatchPerformanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchPerformanceController],
      providers: [MatchPerformanceService],
    }).compile();

    controller = module.get<MatchPerformanceController>(MatchPerformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
