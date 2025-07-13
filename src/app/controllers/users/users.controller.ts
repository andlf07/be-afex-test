import { SearchFilters } from '@context/users/domain/interfaces/user-repository.interface';
import { UsersService } from '@context/users/infrastructure/services/users.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AgentType, UserStatus } from '@context/users/domain/class/User';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(
    @Query('status') status?: UserStatus,
    @Query('agentType') agentType?: AgentType,
    @Query('country') country?: string,
    @Query('amount') amount?: string,
    @Query('name') name?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: SearchFilters = {};

    if (status) filters.status = status;
    if (agentType) filters.agentType = agentType;
    if (country) filters.country = country;
    if (amount) filters.amount = parseFloat(amount);
    if (name) filters.name = name;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);
    if (page) filters.page = parseInt(page, 10);
    if (limit) filters.limit = parseInt(limit, 10);

    return await this.usersService.findAll(Object.keys(filters).length > 0 ? filters : undefined);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
