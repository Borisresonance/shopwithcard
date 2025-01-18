import { Fragment } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProductView } from '../view/ProductView.tsx';
import { ShowProductView } from '../view/ShowProductView.tsx';
import { ResumeTransactionView } from '../view/ResumeTransactionView.tsx';
import { AppLayout } from '../layout/AppLayout.tsx';

export const AppRouter = () => {
  return (
    <Fragment>
      <Routes>
        <Route element={<AppLayout />}>
          {/* redirect / to ->  /products */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductView />} />
          <Route path="/products/:id" element={<ShowProductView />} />
          <Route path="/resume/:id" element={<ResumeTransactionView />} />
        </Route>
      </Routes>
    </Fragment>
  );
};
