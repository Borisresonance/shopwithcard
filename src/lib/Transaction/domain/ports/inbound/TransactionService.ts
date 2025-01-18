import { TransactionEntity } from '../../entity/transaction.entity.ts';
import { TransactionResponse } from '../../../../../transaction/models';

export interface TransactionService {
  createTransaction(transaction: TransactionEntity): Promise<number>;
  getTransaction(transactionId: number): Promise<TransactionResponse>;
}
