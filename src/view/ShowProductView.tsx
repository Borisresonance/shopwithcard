'use client';

import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../store/hook.ts';
import { RootState } from '../store/store.ts';
import { useParams } from 'react-router-dom';
import {
  findProductById,
  updateUnitsOnProduct,
} from '../store/productsSlice.ts';
import { formatPrice } from '../shared/formatPrice.ts';
import { PurchaseModal } from '../transaction/components';

export const ShowProductView = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el parámetro id como string
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const product = useAppSelector(
    (state: RootState) => state.products.productById,
  );

  useEffect(() => {
    if (id) {
      dispatch(findProductById(Number(id))); // Despachar la acción con el ID convertido a número
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      dispatch(
        updateUnitsOnProduct({ productId: product.productId, units: count }),
      );
    }
  }, [count, dispatch, product]);

  if (!product) {
    return <p>Loading product...</p>;
  }
  const breadcrumbs = [
    { id: 'products', name: 'Products', href: '/products' },
    {
      id: product.productId,
      name: product.productName,
      href: `/products/${product.productId}`,
    },
  ];

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product details */}
          <div className="lg:max-w-lg lg:self-end">
            <nav aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                  <li key={breadcrumb.id}>
                    <div className="flex items-center text-sm">
                      <a
                        href={breadcrumb.href}
                        className="font-medium text-gray-500 hover:text-gray-900"
                      >
                        {breadcrumb.name}
                      </a>
                      {breadcrumbIdx !== breadcrumbs.length - 1 ? (
                        <svg
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                        >
                          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.productName}
              </h1>
            </div>

            <section aria-labelledby="information-heading" className="mt-4">
              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>

              <div className="flex items-center">
                <p className="text-lg text-gray-900 sm:text-xl">
                  {formatPrice(product.unitPrice)}
                </p>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-gray-500">
                  {product.productDescription}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <CheckIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-gray-500">
                  ({product.unitsInStock}) In stock and ready to ship
                </p>
              </div>
            </section>
          </div>

          {/* Product image */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
              <img
                alt={product.productName}
                src={product.imageUrl}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product form */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <section aria-labelledby="options-heading">
              {/* count items products */}
              <div className="mt-4 flex flex-row">
                <button
                  onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                  disabled={count === 1}
                  type="button"
                  className="flex w-8 h-9 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  -
                </button>
                <span className="mx-4 text-lg text-gray-900  w-8 h-9 flex text-center items-center justify-center rounded">
                  {count}
                </span>
                <button
                  onClick={() => setCount((prev) => prev + 1)}
                  type="button"
                  disabled={count === product.unitsInStock}
                  className="flex w-8 h-9 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  +
                </button>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setOpen(true)}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Purchase now
                </button>
              </div>
              <div className="mt-6 text-center">
                <a href="#" className="group inline-flex text-base font-medium">
                  <ShieldCheckIcon
                    aria-hidden="true"
                    className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                  <span className="text-gray-500 hover:text-gray-700">
                    Lifetime
                  </span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
      <PurchaseModal open={open} setOpen={setOpen} products={[product]} />
    </>
  );
};
