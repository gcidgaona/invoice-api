import { Invoice } from '../Invoice/invoice.interface';

export interface IConsolid {
  totalDebt: number;
  userDebts: Invoice[];
  userToDebts: Invoice[];
}
