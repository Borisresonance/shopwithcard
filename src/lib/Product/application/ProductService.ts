import { ProductService } from '../domain/ports/inbound/ProductService.ts';
import { ProductRepository } from '../domain/ports/outbound/ProductRepository.ts';

export const createProductService = (
  productRepository: ProductRepository,
): ProductService => {
  return {
    getAll: async () => {
      return await productRepository.getAll();
    },
  };
};
