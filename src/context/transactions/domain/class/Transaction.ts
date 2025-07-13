import { ITransaction } from '../interfaces/transaction.interface';

export enum TransactionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export enum AgentType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  GOVERNMENT = 'GOVERNMENT',
  ORGANIZATION = 'ORGANIZATION',
}

export class Transaction {
  private id: string;
  private data: Date;
  private name: string;
  private amount: number;
  private country: string;
  private agentType: AgentType;
  private status: TransactionStatus;

  constructor(data: ITransaction) {
    this.id = data.id;
    this.data = new Date(data.data);
    this.name = data.name;
    this.amount = data.amount;
    this.country = data.country;
    this.agentType = data.agentType;
    this.status = data.status;
  }

  withId(id: string): Transaction {
    this.id = id;
    return this;
  }

  withData(data: Date): Transaction {
    this.data = data;
    return this;
  }

  withName(name: string): Transaction {
    this.name = name;
    return this;
  }

  withAmount(amount: number): Transaction {
    this.amount = amount;
    return this;
  }

  withCountry(country: string): Transaction {
    this.country = country;
    return this;
  }

  withAgentType(agentType: AgentType): Transaction {
    this.agentType = agentType;
    return this;
  }

  withStatus(status: TransactionStatus): Transaction {
    this.status = status;
    return this;
  }
}
