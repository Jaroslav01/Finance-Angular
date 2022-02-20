import {User} from "./user.model";

export interface FinanceMonthPlan{
  id: number;
  amount: number;
  updatedDate: number;
  createdDate: number;
  user: User
}
