import { Test, TestingModule } from '@nestjs/testing';
import { ConversasService } from './conversas.service';

describe('ConversasService', () => {
  let service: ConversasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversasService],
    }).compile();

    service = module.get<ConversasService>(ConversasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
