import { AgentType, TransactionStatus } from '../class/Transaction';

export interface ITransaction {
  id: string;
  data: Date;
  name: string;
  amount: number;
  country: string;
  agentType: AgentType;
  status: TransactionStatus;
}
