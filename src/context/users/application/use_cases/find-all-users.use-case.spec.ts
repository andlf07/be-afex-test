import { Test, TestingModule } from '@nestjs/testing';
import FindAllUsers from './find-all-users.use-case';
import { IUserRepository, SearchFilters, PaginatedResult } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { AgentType, UserStatus } from '../../domain/class/User';

describe('FindAllUsers', () => {
  let useCase: FindAllUsers;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUsers: IUser[] = [
    {
      id: '1',
      data: new Date('2021-01-01'),
      name: 'John Doe',
      amount: 100,
      country: 'US',
      agentType: AgentType.INDIVIDUAL,
      status: UserStatus.ACTIVE,
    },
    {
      id: '2',
      data: new Date('2021-02-15'),
      name: 'Maria Garcia',
      amount: 250,
      country: 'ES',
      agentType: AgentType.INDIVIDUAL,
      status: UserStatus.ACTIVE,
    },
  ];

  const mockPaginatedResult: PaginatedResult<IUser> = {
    data: mockUsers,
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: 'UserRepository',
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllUsers, mockRepositoryProvider],
    }).compile();

    useCase = module.get<FindAllUsers>(FindAllUsers);
    mockRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should call repository.findAll with no filters when none provided', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.run();

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should call repository.findAll with provided filters', async () => {
      const filters: SearchFilters = {
        status: UserStatus.ACTIVE,
        page: 1,
        limit: 5,
      };
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.run(filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should return paginated result from repository', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.run();

      expect(result.data).toEqual(mockUsers);
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });

    it('should handle empty results', async () => {
      const emptyResult: PaginatedResult<IUser> = {
        data: [],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockRepository.findAll.mockResolvedValue(emptyResult);

      const result = await useCase.run();

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Repository error');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(useCase.run()).rejects.toThrow('Repository error');
    });

    it('should handle complex filters', async () => {
      const complexFilters: SearchFilters = {
        status: UserStatus.ACTIVE,
        agentType: AgentType.COMPANY,
        country: 'US',
        amount: 1000,
        name: 'test',
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31'),
        page: 2,
        limit: 20,
      };
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      await useCase.run(complexFilters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(complexFilters);
    });
  });
});