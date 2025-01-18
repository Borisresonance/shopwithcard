import { ProductRepository } from '../domain/ports/outbound/ProductRepository.ts';
import { axiosService } from '../../../shared';
import { ProductEntity } from '../domain/entity/product.entity.ts';
import { ResponseRequest } from '../../../shared/responseRequest.ts';

export const createFetchProductRepository = (): ProductRepository => {
  return {
    getAll: async () => {
      const request = await axiosService.get<ResponseRequest<ProductEntity[]>>(
        '/product',
      );
      return request.data.data;
    },
  };
};
