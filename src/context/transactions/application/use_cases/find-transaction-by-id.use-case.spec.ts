import { Test, TestingModule } from '@nestjs/testing';
import { AgentType, TransactionStatus } from '../../domain/class/Transaction';
import { ITransactionRepository } from '../../domain/interfaces/transaction-repository.interface';
import { ITransaction } from '../../domain/interfaces/transaction.interface';
import FindTransactionById from './find-transaction-by-id.use-case';

describe('FindTransactionById', () => {
  let useCase: FindTransactionById;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  const mockTransaction: ITransaction = {
    id: '1',
    data: new Date('2021-01-01'),
    name: 'John Doe',
    amount: 100,
    country: 'US',
    agentType: AgentType.INDIVIDUAL,
    status: TransactionStatus.ACTIVE,
  };

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: 'TransactionRepository',
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindTransactionById, mockRepositoryProvider],
    }).compile();

    useCase = module.get<FindTransactionById>(FindTransactionById);
    mockRepository = module.get('TransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('debería retornar la transacción cuando se proporciona un ID válido', async () => {
      mockRepository.findById.mockResolvedValue(mockTransaction);

      const result = await useCase.run('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTransaction);
    });

    it('debería retornar null cuando no se encuentra la transacción', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await useCase.run('999');

      expect(mockRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('debería lanzar error cuando el ID está vacío', async () => {
      await expect(useCase.run('')).rejects.toThrow('Transaction ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el ID solo contiene espacios en blanco', async () => {
      await expect(useCase.run('   ')).rejects.toThrow('Transaction ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el ID es undefined', async () => {
      await expect(useCase.run(undefined as any)).rejects.toThrow(
        'Transaction ID is required',
      );
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el ID es null', async () => {
      await expect(useCase.run(null as any)).rejects.toThrow(
        'Transaction ID is required',
      );
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('debería propagar errores del repositorio', async () => {
      const error = new Error('Repository error');
      mockRepository.findById.mockRejectedValue(error);

      await expect(useCase.run('1')).rejects.toThrow('Repository error');
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('debería manejar caracteres especiales en el ID', async () => {
      const specialId = 'user-123_test@domain.com';
      mockRepository.findById.mockResolvedValue(mockTransaction);

      const result = await useCase.run(specialId);

      expect(mockRepository.findById).toHaveBeenCalledWith(specialId);
      expect(result).toEqual(mockTransaction);
    });

    it('debería manejar IDs de cadena numérica', async () => {
      mockRepository.findById.mockResolvedValue(mockTransaction);

      const result = await useCase.run('123456');

      expect(mockRepository.findById).toHaveBeenCalledWith('123456');
      expect(result).toEqual(mockTransaction);
    });

    it('debería eliminar espacios en blanco del ID antes de la validación', async () => {
      await expect(useCase.run('  \t\n  ')).rejects.toThrow(
        'Transaction ID is required',
      );
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });
});
