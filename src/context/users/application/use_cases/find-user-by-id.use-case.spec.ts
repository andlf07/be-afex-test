import { Test, TestingModule } from '@nestjs/testing';
import FindUserById from './find-user-by-id.use-case';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { AgentType, UserStatus } from '../../domain/class/User';

describe('FindUserById', () => {
  let useCase: FindUserById;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser: IUser = {
    id: '1',
    data: new Date('2021-01-01'),
    name: 'John Doe',
    amount: 100,
    country: 'US',
    agentType: AgentType.INDIVIDUAL,
    status: UserStatus.ACTIVE,
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
      providers: [FindUserById, mockRepositoryProvider],
    }).compile();

    useCase = module.get<FindUserById>(FindUserById);
    mockRepository = module.get('UserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should return user when valid ID is provided', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await useCase.run('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await useCase.run('999');

      expect(mockRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should throw error when ID is empty', async () => {
      await expect(useCase.run('')).rejects.toThrow('User ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when ID is only whitespace', async () => {
      await expect(useCase.run('   ')).rejects.toThrow('User ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when ID is undefined', async () => {
      await expect(useCase.run(undefined as any)).rejects.toThrow('User ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when ID is null', async () => {
      await expect(useCase.run(null as any)).rejects.toThrow('User ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Repository error');
      mockRepository.findById.mockRejectedValue(error);

      await expect(useCase.run('1')).rejects.toThrow('Repository error');
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should handle special characters in ID', async () => {
      const specialId = 'user-123_test@domain.com';
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await useCase.run(specialId);

      expect(mockRepository.findById).toHaveBeenCalledWith(specialId);
      expect(result).toEqual(mockUser);
    });

    it('should handle numeric string IDs', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await useCase.run('123456');

      expect(mockRepository.findById).toHaveBeenCalledWith('123456');
      expect(result).toEqual(mockUser);
    });

    it('should trim whitespace from ID before validation', async () => {
      await expect(useCase.run('  \t\n  ')).rejects.toThrow('User ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });
});