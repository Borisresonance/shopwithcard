import { ListProduct } from '../products';
import { useAppDispatch } from '../store/hook.ts';
import { useEffect } from 'react';
import { fetchProducts } from '../store/productsSlice.ts';

export const ProductView = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  return (
    <>
      <ListProduct />
    </>
  );
};
