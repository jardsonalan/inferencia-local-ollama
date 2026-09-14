import { Test, TestingModule } from '@nestjs/testing';
import { ConversasController } from './conversas.controller';
import { ConversasService } from './conversas.service';

describe('ConversasController', () => {
  let controller: ConversasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversasController],
      providers: [ConversasService],
    }).compile();

    controller = module.get<ConversasController>(ConversasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
