import { IUser } from '../interfaces/user.interface';

export enum UserStatus {
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

export class User {
  private id: string;
  private data: Date;
  private name: string;
  private amount: number;
  private country: string;
  private agentType: AgentType;
  private status: UserStatus;

  constructor(data: IUser) {
    this.id = data.id;
    this.data = new Date(data.data);
    this.name = data.name;
    this.amount = data.amount;
    this.country = data.country;
    this.agentType = data.agentType;
    this.status = data.status;
  }

  withId(id: string): User {
    this.id = id;
    return this;
  }

  withData(data: Date): User {
    this.data = data;
    return this;
  }

  withName(name: string): User {
    this.name = name;
    return this;
  }

  withAmount(amount: number): User {
    this.amount = amount;
    return this;
  }

  withCountry(country: string): User {
    this.country = country;
    return this;
  }

  withAgentType(agentType: AgentType): User {
    this.agentType = agentType;
    return this;
  }

  withStatus(status: UserStatus): User {
    this.status = status;
    return this;
  }
}
