import { Test, TestingModule } from '@nestjs/testing';
import FindAllTransactions from '../../application/use_cases/find-all-transactions.use-case';
import FindTransactionById from '../../application/use_cases/find-transaction-by-id.use-case';
import { AgentType, TransactionStatus } from '../../domain/class/Transaction';
import {
  PaginatedResult,
  SearchFilters,
} from '../../domain/interfaces/transaction-repository.interface';
import { ITransaction } from '../../domain/interfaces/transaction.interface';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockFindAllTransactions: jest.Mocked<FindAllTransactions>;
  let mockFindTransactionById: jest.Mocked<FindTransactionById>;

  const mockTransaction: ITransaction = {
    id: '1',
    data: new Date('2021-01-01'),
    name: 'John Doe',
    amount: 100,
    country: 'US',
    agentType: AgentType.INDIVIDUAL,
    status: TransactionStatus.ACTIVE,
  };

  const mockPaginatedResult: PaginatedResult<ITransaction> = {
    data: [mockTransaction],
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
    const mockFindAllTransactionsProvider = {
      provide: FindAllTransactions,
      useValue: {
        run: jest.fn(),
      },
    };

    const mockFindTransactionByIdProvider = {
      provide: FindTransactionById,
      useValue: {
        run: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        mockFindAllTransactionsProvider,
        mockFindTransactionByIdProvider,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    mockFindAllTransactions = module.get(FindAllTransactions);
    mockFindTransactionById = module.get(FindTransactionById);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería llamar al caso de uso FindAllTransactions sin filtros cuando no se proporcionan', async () => {
      mockFindAllTransactions.run.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll();

      expect(mockFindAllTransactions.run).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería llamar al caso de uso FindAllTransactions con los filtros proporcionados', async () => {
      const filters: SearchFilters = {
        status: TransactionStatus.ACTIVE,
        page: 1,
        limit: 5,
      };
      mockFindAllTransactions.run.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(filters);

      expect(mockFindAllTransactions.run).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería retornar resultado paginado del caso de uso', async () => {
      mockFindAllTransactions.run.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll();

      expect(result.data).toEqual([mockTransaction]);
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });

    it('debería manejar resultados vacíos', async () => {
      const emptyResult: PaginatedResult<ITransaction> = {
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
      mockFindAllTransactions.run.mockResolvedValue(emptyResult);

      const result = await service.findAll();

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('debería propagar errores del caso de uso', async () => {
      const error = new Error('Use case error');
      mockFindAllTransactions.run.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Use case error');
    });

    it('debería manejar filtros complejos', async () => {
      const complexFilters: SearchFilters = {
        status: TransactionStatus.ACTIVE,
        agentType: AgentType.COMPANY,
        country: 'US',
        amount: 1000,
        name: 'test',
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31'),
        page: 2,
        limit: 20,
      };
      mockFindAllTransactions.run.mockResolvedValue(mockPaginatedResult);

      await service.findAll(complexFilters);

      expect(mockFindAllTransactions.run).toHaveBeenCalledWith(complexFilters);
    });
  });

  describe('findById', () => {
    it('debería llamar al caso de uso FindTransactionById con el ID proporcionado', async () => {
      mockFindTransactionById.run.mockResolvedValue(mockTransaction);

      const result = await service.findById('1');

      expect(mockFindTransactionById.run).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTransaction);
    });

    it('debería retornar null cuando no se encuentra la transacción', async () => {
      mockFindTransactionById.run.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(mockFindTransactionById.run).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('debería propagar errores del caso de uso', async () => {
      const error = new Error('Use case error');
      mockFindTransactionById.run.mockRejectedValue(error);

      await expect(service.findById('1')).rejects.toThrow('Use case error');
      expect(mockFindTransactionById.run).toHaveBeenCalledWith('1');
    });

    it('debería manejar caracteres especiales en el ID', async () => {
      const specialId = 'user-123_test@domain.com';
      mockFindTransactionById.run.mockResolvedValue(mockTransaction);

      const result = await service.findById(specialId);

      expect(mockFindTransactionById.run).toHaveBeenCalledWith(specialId);
      expect(result).toEqual(mockTransaction);
    });

    it('debería manejar un ID de cadena vacía', async () => {
      const error = new Error('Transaction ID is required');
      mockFindTransactionById.run.mockRejectedValue(error);

      await expect(service.findById('')).rejects.toThrow('Transaction ID is required');
      expect(mockFindTransactionById.run).toHaveBeenCalledWith('');
    });
  });
});
