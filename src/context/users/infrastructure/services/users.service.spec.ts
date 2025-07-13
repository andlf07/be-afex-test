import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import FindAllUsers from '../../application/use_cases/find-all-users.use-case';
import FindUserById from '../../application/use_cases/find-user-by-id.use-case';
import { SearchFilters, PaginatedResult } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { AgentType, UserStatus } from '../../domain/class/User';

describe('UsersService', () => {
  let service: UsersService;
  let mockFindAllUsers: jest.Mocked<FindAllUsers>;
  let mockFindUserById: jest.Mocked<FindUserById>;

  const mockUser: IUser = {
    id: '1',
    data: new Date('2021-01-01'),
    name: 'John Doe',
    amount: 100,
    country: 'US',
    agentType: AgentType.INDIVIDUAL,
    status: UserStatus.ACTIVE,
  };

  const mockPaginatedResult: PaginatedResult<IUser> = {
    data: [mockUser],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  beforeEach(async () => {
    const mockFindAllUsersProvider = {
      provide: FindAllUsers,
      useValue: {
        run: jest.fn(),
      },
    };

    const mockFindUserByIdProvider = {
      provide: FindUserById,
      useValue: {
        run: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        mockFindAllUsersProvider,
        mockFindUserByIdProvider,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockFindAllUsers = module.get(FindAllUsers);
    mockFindUserById = module.get(FindUserById);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call FindAllUsers use case with no filters when none provided', async () => {
      mockFindAllUsers.run.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll();

      expect(mockFindAllUsers.run).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should call FindAllUsers use case with provided filters', async () => {
      const filters: SearchFilters = {
        status: UserStatus.ACTIVE,
        page: 1,
        limit: 5,
      };
      mockFindAllUsers.run.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(filters);

      expect(mockFindAllUsers.run).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should return paginated result from use case', async () => {
      mockFindAllUsers.run.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll();

      expect(result.data).toEqual([mockUser]);
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
      mockFindAllUsers.run.mockResolvedValue(emptyResult);

      const result = await service.findAll();

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should propagate use case errors', async () => {
      const error = new Error('Use case error');
      mockFindAllUsers.run.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Use case error');
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
      mockFindAllUsers.run.mockResolvedValue(mockPaginatedResult);

      await service.findAll(complexFilters);

      expect(mockFindAllUsers.run).toHaveBeenCalledWith(complexFilters);
    });
  });

  describe('findById', () => {
    it('should call FindUserById use case with provided ID', async () => {
      mockFindUserById.run.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(mockFindUserById.run).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockFindUserById.run.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(mockFindUserById.run).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should propagate use case errors', async () => {
      const error = new Error('Use case error');
      mockFindUserById.run.mockRejectedValue(error);

      await expect(service.findById('1')).rejects.toThrow('Use case error');
      expect(mockFindUserById.run).toHaveBeenCalledWith('1');
    });

    it('should handle special characters in ID', async () => {
      const specialId = 'user-123_test@domain.com';
      mockFindUserById.run.mockResolvedValue(mockUser);

      const result = await service.findById(specialId);

      expect(mockFindUserById.run).toHaveBeenCalledWith(specialId);
      expect(result).toEqual(mockUser);
    });

    it('should handle empty string ID', async () => {
      const error = new Error('User ID is required');
      mockFindUserById.run.mockRejectedValue(error);

      await expect(service.findById('')).rejects.toThrow('User ID is required');
      expect(mockFindUserById.run).toHaveBeenCalledWith('');
    });
  });
});