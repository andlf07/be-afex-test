import { UserRepository } from './user.repository';
import { AgentType, UserStatus } from '../../domain/class/User';
import { SearchFilters } from '../../domain/interfaces/user-repository.interface';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
  });

  describe('findAll', () => {
    it('should return all users when no filters are provided', async () => {
      const result = await repository.findAll();
      
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.data.length).toBe(10); // Default limit
      expect(result.meta.totalItems).toBe(51); // Total users in dataset
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalPages).toBe(6);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should return paginated results', async () => {
      const filters: SearchFilters = { page: 2, limit: 5 };
      const result = await repository.findAll(filters);
      
      expect(result.data.length).toBe(5);
      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.itemsPerPage).toBe(5);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should filter by status', async () => {
      const filters: SearchFilters = { status: UserStatus.ACTIVE };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => user.status === UserStatus.ACTIVE)).toBe(true);
      expect(result.data.length).toBe(10); // Limited by default pagination
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('should filter by agentType', async () => {
      const filters: SearchFilters = { agentType: AgentType.COMPANY };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => user.agentType === AgentType.COMPANY)).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('should filter by country (case insensitive)', async () => {
      const filters: SearchFilters = { country: 'us' };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => user.country.toLowerCase().includes('us'))).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('should filter by exact amount', async () => {
      const filters: SearchFilters = { amount: 100 };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => user.amount === 100)).toBe(true);
    });

    it('should filter by name (case insensitive)', async () => {
      const filters: SearchFilters = { name: 'john' };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => user.name.toLowerCase().includes('john'))).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('should filter by date range', async () => {
      const filters: SearchFilters = {
        dateFrom: new Date('2022-01-01'),
        dateTo: new Date('2022-12-31')
      };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => {
        const userDate = new Date(user.data);
        return userDate >= filters.dateFrom! && userDate <= filters.dateTo!;
      })).toBe(true);
      expect(result.meta.totalItems).toBeGreaterThan(0);
    });

    it('should apply multiple filters', async () => {
      const filters: SearchFilters = {
        status: UserStatus.ACTIVE,
        agentType: AgentType.INDIVIDUAL,
        country: 'US'
      };
      const result = await repository.findAll(filters);
      
      expect(result.data.every(user => 
        user.status === UserStatus.ACTIVE &&
        user.agentType === AgentType.INDIVIDUAL &&
        user.country.toLowerCase().includes('us')
      )).toBe(true);
    });

    it('should return empty results when no matches found', async () => {
      const filters: SearchFilters = { country: 'NONEXISTENT' };
      const result = await repository.findAll(filters);
      
      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });

    it('should handle last page correctly', async () => {
      const filters: SearchFilters = { page: 6, limit: 10 };
      const result = await repository.findAll(filters);
      
      expect(result.data.length).toBe(1); // Only 1 item on last page (51 total items)
      expect(result.meta.currentPage).toBe(6);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return user when valid ID is provided', async () => {
      const result = await repository.findById('1');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('John Doe');
    });

    it('should return null when user not found', async () => {
      const result = await repository.findById('999');
      
      expect(result).toBeNull();
    });

    it('should return null for empty ID', async () => {
      const result = await repository.findById('');
      
      expect(result).toBeNull();
    });
  });
});