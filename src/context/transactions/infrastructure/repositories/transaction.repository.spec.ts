import { TransactionRepository } from './transaction.repository';
import { AgentType, TransactionStatus } from '../../domain/class/Transaction';
import { SearchFilters } from '../../domain/interfaces/transaction-repository.interface';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;

  beforeEach(() => {
    repository = new TransactionRepository();
  });

  describe('findAll', () => {
    it('debería retornar todas las transacciones cuando no se proporcionan filtros', async () => {
      const result = await repository.findAll();
      
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.data.length).toBe(10); // Default limit
      expect(result.meta.totalItems).toBe(51); // Total transactions in dataset
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalPages).toBe(6);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('debería retornar resultados paginados', async () => {
      const filters: SearchFilters = { page: 2, limit: 5 };
      const result = await repository.findAll(filters);
      
      expect(result.data.length).toBe(5);
      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.itemsPerPage).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('debería filtrar por estado', async () => {
      const filters: SearchFilters = { status: TransactionStatus.ACTIVE };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => transaction.status === TransactionStatus.ACTIVE)).toBe(true);
      expect(result.data.length).toBe(10); // Limited by default pagination
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('debería filtrar por tipo de agente', async () => {
      const filters: SearchFilters = { agentType: AgentType.COMPANY };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => transaction.agentType === AgentType.COMPANY)).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('debería filtrar por país (insensible a mayúsculas)', async () => {
      const filters: SearchFilters = { country: 'us' };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => transaction.country.toLowerCase().includes('us'))).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('debería filtrar por monto exacto', async () => {
      const filters: SearchFilters = { amount: 100 };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => transaction.amount === 100)).toBe(true);
    });

    it('debería filtrar por nombre (insensible a mayúsculas)', async () => {
      const filters: SearchFilters = { name: 'john' };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => transaction.name.toLowerCase().includes('john'))).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('debería filtrar por rango de fechas', async () => {
      const filters: SearchFilters = {
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31')
      };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => {
        const transactionDate = new Date(transaction.data);
        return transactionDate >= filters.dateFrom! && transactionDate <= filters.dateTo!;
      })).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('debería aplicar múltiples filtros', async () => {
      const filters: SearchFilters = {
        status: TransactionStatus.ACTIVE,
        agentType: AgentType.INDIVIDUAL,
        country: 'US'
      };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(transaction => 
        transaction.status === TransactionStatus.ACTIVE &&
        transaction.agentType === AgentType.INDIVIDUAL &&
        transaction.country.toLowerCase().includes('us')
      )).toBe(true);
    });

    it('debería retornar resultados vacíos cuando no se encuentran coincidencias', async () => {
      const filters: SearchFilters = { country: 'NONEXISTENT' };
      const result = await repository.findAll(filters);
      
      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });

    it('debería manejar correctamente la última página', async () => {
      const filters: SearchFilters = { page: 6, limit: 10 };
      const result = await repository.findAll(filters);
      
      expect(result.data.length).toBe(1); // Only 1 item on last page (51 total items)
      expect(result.meta.currentPage).toBe(6);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });
  });

  describe('findById', () => {
    it('debería retornar la transacción cuando se proporciona un ID válido', async () => {
      const result = await repository.findById('1');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('John Doe');
    });

    it('debería retornar null cuando no se encuentra la transacción', async () => {
      const result = await repository.findById('999');
      
      expect(result).toBeNull();
    });

    it('debería retornar null para un ID vacío', async () => {
      const result = await repository.findById('');
      
      expect(result).toBeNull();
    });
  });
});