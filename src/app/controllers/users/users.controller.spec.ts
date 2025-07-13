import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '@context/users/infrastructure/services/users.service';
import { AgentType, UserStatus } from '@context/users/domain/class/User';
import { PaginatedResult } from '@context/users/domain/interfaces/user-repository.interface';
import { IUser } from '@context/users/domain/interfaces/user.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: jest.Mocked<UsersService>;

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
    const mockUsersServiceProvider = {
      provide: UsersService,
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [mockUsersServiceProvider],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockUsersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users with no filters when no query params provided', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers();

      expect(mockUsersService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should filter by status', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(UserStatus.ACTIVE);

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        status: UserStatus.ACTIVE,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should filter by agentType', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(undefined, AgentType.COMPANY);

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        agentType: AgentType.COMPANY,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should filter by country', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(undefined, undefined, 'US');

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        country: 'US',
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should filter by amount', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(undefined, undefined, undefined, '100');

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        amount: 100,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should filter by name', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(undefined, undefined, undefined, undefined, 'John');

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        name: 'John',
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should filter by date range', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(
        undefined, undefined, undefined, undefined, undefined,
        '2022-01-01', '2022-12-31'
      );

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31'),
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle pagination parameters', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(
        undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, '2', '5'
      );

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle multiple filters combined', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(
        UserStatus.ACTIVE,
        AgentType.INDIVIDUAL,
        'US',
        '100',
        'John',
        '2022-01-01',
        '2022-12-31',
        '1',
        '10'
      );

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        status: UserStatus.ACTIVE,
        agentType: AgentType.INDIVIDUAL,
        country: 'US',
        amount: 100,
        name: 'John',
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31'),
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle invalid amount gracefully', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(
        undefined, undefined, undefined, 'invalid'
      );

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        amount: NaN,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle invalid pagination parameters', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getUsers(
        undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, 'invalid', 'invalid'
      );

      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: NaN,
        limit: NaN,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      mockUsersService.findAll.mockRejectedValue(error);

      await expect(controller.getUsers()).rejects.toThrow('Service error');
    });
  });

  describe('getUserById', () => {
    it('should return user when valid ID is provided', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1');

      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      const result = await controller.getUserById('999');

      expect(mockUsersService.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      mockUsersService.findById.mockRejectedValue(error);

      await expect(controller.getUserById('1')).rejects.toThrow('Service error');
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });

    it('should handle special characters in ID', async () => {
      const specialId = 'user-123_test@domain.com';
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(specialId);

      expect(mockUsersService.findById).toHaveBeenCalledWith(specialId);
      expect(result).toEqual(mockUser);
    });

    it('should handle empty string ID', async () => {
      const error = new Error('User ID is required');
      mockUsersService.findById.mockRejectedValue(error);

      await expect(controller.getUserById('')).rejects.toThrow('User ID is required');
      expect(mockUsersService.findById).toHaveBeenCalledWith('');
    });
  });
});