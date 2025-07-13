import {
  AgentType,
  TransactionStatus,
} from '@context/transactions/domain/class/Transaction';
import { PaginatedResult } from '@context/transactions/domain/interfaces/transaction-repository.interface';
import { ITransaction } from '@context/transactions/domain/interfaces/transaction.interface';
import { TransactionsService } from '@context/transactions/infrastructure/services/transactions.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let mockTransactionsService: jest.Mocked<TransactionsService>;

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
    const mockTransactionsServiceProvider = {
      provide: TransactionsService,
      useValue: {
        findAll: jest.fn(),
        findById: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [mockTransactionsServiceProvider],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    mockTransactionsService = module.get(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('debería retornar transacciones sin filtros cuando no se proporcionan parámetros de consulta', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions();

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería filtrar por estado', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(TransactionStatus.ACTIVE);

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        status: TransactionStatus.ACTIVE,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería filtrar por tipo de agente', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        AgentType.COMPANY,
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        agentType: AgentType.COMPANY,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería filtrar por país', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        'US',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        country: 'US',
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería filtrar por monto', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        undefined,
        '100',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        amount: 100,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería filtrar por nombre', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        undefined,
        undefined,
        'John',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        name: 'John',
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería filtrar por rango de fechas', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '2022-01-01',
        '2022-12-31',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31'),
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería manejar parámetros de paginación', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '2',
        '5',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería manejar múltiples filtros combinados', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        TransactionStatus.ACTIVE,
        AgentType.INDIVIDUAL,
        'US',
        '100',
        'John',
        '2022-01-01',
        '2022-12-31',
        '1',
        '10',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        status: TransactionStatus.ACTIVE,
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

    it('debería manejar monto inválido de manera elegante', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        undefined,
        'invalid',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        amount: NaN,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería manejar parámetros de paginación inválidos', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getTransactions(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'invalid',
        'invalid',
      );

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith({
        page: NaN,
        limit: NaN,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debería propagar errores del servicio', async () => {
      const error = new Error('Service error');
      mockTransactionsService.findAll.mockRejectedValue(error);

      await expect(controller.getTransactions()).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('getTransactionById', () => {
    it('debería retornar la transacción cuando se proporciona un ID válido', async () => {
      mockTransactionsService.findById.mockResolvedValue(mockTransaction);

      const result = await controller.getTransactionById('1');

      expect(mockTransactionsService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTransaction);
    });

    it('debería retornar null cuando no se encuentra la transacción', async () => {
      mockTransactionsService.findById.mockResolvedValue(null);

      const result = await controller.getTransactionById('999');

      expect(mockTransactionsService.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('debería propagar errores del servicio', async () => {
      const error = new Error('Service error');
      mockTransactionsService.findById.mockRejectedValue(error);

      await expect(controller.getTransactionById('1')).rejects.toThrow(
        'Service error',
      );
      expect(mockTransactionsService.findById).toHaveBeenCalledWith('1');
    });

    it('debería manejar caracteres especiales en el ID', async () => {
      const specialId = 'transaction-123_test@domain.com';
      mockTransactionsService.findById.mockResolvedValue(mockTransaction);

      const result = await controller.getTransactionById(specialId);

      expect(mockTransactionsService.findById).toHaveBeenCalledWith(specialId);
      expect(result).toEqual(mockTransaction);
    });

    it('debería manejar un ID de cadena vacía', async () => {
      const error = new Error('Transaction ID is required');
      mockTransactionsService.findById.mockRejectedValue(error);

      await expect(controller.getTransactionById('')).rejects.toThrow(
        'Transaction ID is required',
      );
      expect(mockTransactionsService.findById).toHaveBeenCalledWith('');
    });
  });
});
