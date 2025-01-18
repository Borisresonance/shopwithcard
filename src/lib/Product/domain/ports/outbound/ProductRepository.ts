import { ProductEntity } from '../../entity/product.entity.ts';

export interface ProductRepository {
  getAll(): Promise<ProductEntity[]>;
}
