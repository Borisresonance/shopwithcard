import { Product } from '../models/Product';
import {
  createAsyncThunk,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import { createFetchProductRepository } from '../lib/Product/infraestructure/FetchProductRepository.ts';
import { createProductService } from '../lib/Product/application/ProductService.ts';

export interface ProductsState {
  products: Product[];
  productById: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductsState = {
  products: [],
  productById: null,
  loading: false,
  error: null,
};

const repository = createFetchProductRepository();
const service = createProductService(repository);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return await service.getAll();
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    findProductById(
      state: Draft<ProductsState>,
      action: PayloadAction<number>,
    ) {
      state.productById =
        state.products.find(
          (product) => product.productId === action.payload,
        ) || null;
    },
    resetAndSetProducts(
      state: Draft<ProductsState>,
      action: PayloadAction<Product[]>,
    ) {
      state.products = action.payload;
    },
    updateUnitsOnProduct(
      state: Draft<ProductsState>,
      action: PayloadAction<{ productId: number; units: number }>,
    ) {
      const product = state.products.find(
        (product) => product.productId === action.payload.productId,
      );
      if (product) {
        product.unitsOnOrder = action.payload.units;
        state.productById = product;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state: Draft<ProductsState>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state: Draft<ProductsState>, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        },
      )
      .addCase(
        fetchProducts.rejected,
        (state: Draft<ProductsState>, action) => {
          state.loading = false;
          state.error = action.error.message || 'An error occurred.';
        },
      );
  },
});

export const { findProductById, resetAndSetProducts, updateUnitsOnProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
