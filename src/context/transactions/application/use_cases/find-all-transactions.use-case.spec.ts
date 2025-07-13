import {
  AgentType,
  TransactionStatus,
} from '@context/transactions/domain/class/Transaction';
import { ITransaction } from '@context/transactions/domain/interfaces/transaction.interface';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ITransactionRepository,
  PaginatedResult,
  SearchFilters,
} from '../../domain/interfaces/transaction-repository.interface';
import FindAllTransactions from './find-all-transactions.use-case';

describe('FindAllTransactions', () => {
  let useCase: FindAllTransactions;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  const mockTransactions: ITransaction[] = [
    {
      id: '1',
      data: new Date('2021-01-01'),
      name: 'John Doe',
      amount: 100,
      country: 'US',
      agentType: AgentType.INDIVIDUAL,
      status: TransactionStatus.ACTIVE,
    },
    {
      id: '2',
      data: new Date('2021-02-15'),
      name: 'Maria Garcia',
      amount: 250,
      country: 'ES',
      agentType: AgentType.INDIVIDUAL,
      status: TransactionStatus.PENDING,
    },
  ];

  const mockPaginatedResult: PaginatedResult<ITransaction> = {
    data: mockTransactions,
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
      provide: 'TransactionRepository',
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllTransactions, mockRepositoryProvider],
    }).compile();

    useCase = module.get<FindAllTransactions>(FindAllTransactions);
    mockRepository = module.get('TransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('debería llamar a repository.findAll sin filtros cuando no se proporcionan', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.run();

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería llamar a repository.findAll con los filtros proporcionados', async () => {
      const filters: SearchFilters = {
        status: TransactionStatus.ACTIVE,
        page: 1,
        limit: 5,
      };
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.run(filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería retornar resultado paginado del repositorio', async () => {
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.run();

      expect(result.data).toEqual(mockTransactions);
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
      mockRepository.findAll.mockResolvedValue(emptyResult);

      const result = await useCase.run();

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('debería propagar errores del repositorio', async () => {
      const error = new Error('Repository error');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(useCase.run()).rejects.toThrow('Repository error');
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
      mockRepository.findAll.mockResolvedValue(mockPaginatedResult);

      await useCase.run(complexFilters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(complexFilters);
    });
  });
});
