import { TransactionRepository } from '../domain/ports/outbound/TransactionRepository.ts';
import { TransactionEntity } from '../domain/entity/transaction.entity.ts';
import { ResponseRequest } from '../../../shared/responseRequest.ts';
import { axiosService } from '../../../shared';
import { TransactionResponse } from '../../../transaction/models';

export const createFetchTransactionRepository = (): TransactionRepository => {
  return {
    createTransaction: async (
      transaction: TransactionEntity,
    ): Promise<number> => {
      const request = await axiosService.post<
        ResponseRequest<{ IdTransaction: number }>
      >('/transaction', transaction);
      return request.data.data.IdTransaction;
    },
    getTransaction: async (
      transactionId: number,
    ): Promise<TransactionResponse> => {
      const request = await axiosService.get<
        ResponseRequest<TransactionResponse>
      >(`/transaction/${transactionId}`);
      return request.data.data;
    },
  };
};
