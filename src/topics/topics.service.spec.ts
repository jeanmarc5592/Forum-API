import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { MockType, repositoryMockFactory } from '../app.types';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubCategoriesService } from '../categories/sub-categories/sub-categories.service';
import { UsersService } from '../users/users.service';

describe('TopicsService', () => {
  let service: TopicsService;
  let repositoryMock: MockType<Repository<Topic>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: getRepositoryToken(Topic),
          useFactory: repositoryMockFactory,
        },
        {
          provide: UsersService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: SubCategoriesService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    repositoryMock = module.get(getRepositoryToken(Topic));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
