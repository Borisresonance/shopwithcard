import { ProductEntity } from '../../entity/product.entity.ts';

export interface ProductService {
  getAll(): Promise<ProductEntity[]>;
}
