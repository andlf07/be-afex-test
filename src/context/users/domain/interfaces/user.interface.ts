import { AgentType, UserStatus } from '../class/User';

export interface IUser {
  id: string;
  data: Date;
  name: string;
  amount: number;
  country: string;
  agentType: AgentType;
  status: UserStatus;
}
