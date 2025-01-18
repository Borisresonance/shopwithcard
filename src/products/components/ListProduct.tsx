import React from 'react';
import { RootState } from '../../store/store.ts';
import { useAppSelector } from '../../store/hook.ts';
import { formatPrice } from '../../shared/formatPrice.ts';

// import icon ->
import { ArrowRightIcon } from '@heroicons/react/20/solid';

interface ListProductProps {}

export const ListProduct: React.FC<ListProductProps> = () => {
  const products = useAppSelector(
    (state: RootState) => state.products.products,
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.productId}
              className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
            >
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  alt={product.productName}
                  src={product.imageUrl}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pb-4 pt-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={`/products/${product.productId}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.productName}
                  </a>
                </h3>
                <p className="mt-4 text-base font-medium text-gray-900">
                  {formatPrice(product.unitPrice)}
                </p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="w-full inline-flex items-center gap-4 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Show details <ArrowRightIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
