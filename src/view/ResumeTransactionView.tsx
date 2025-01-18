import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createFetchTransactionRepository } from '../lib/Transaction/infraestructure/FetchProductRepository.ts';
import { createTransactionService } from '../lib/Transaction/application/TransactionService.ts';
import { TransactionResponse } from '../transaction/models';
import { formatPrice } from '../shared/formatPrice.ts';

export const ResumeTransactionView = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionResponse>();
  const repository = createFetchTransactionRepository();
  const service = createTransactionService(repository);

  useEffect(() => {
    service
      .getTransaction(Number(id))
      .then((transaction: TransactionResponse) => setTransaction(transaction));
  }, [id]);

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 py-16 pt-8 sm:px-6 sm:py-24 sm:pt-8 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            It's on the way!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your order #{transaction?.transactionId} has shipped and will be
            with you soon.
          </p>

          <dl className="mt-4 text-sm font-medium">
            <dt className="text-gray-900">Payment status</dt>
            <dd
              className={`mt-2 ${
                transaction?.status === 'APPROVED'
                  ? 'text-green-600'
                  : 'text-red-400'
              }`}
            >
              {transaction?.status}
            </dd>
          </dl>
          <dl className="mt-8 text-sm font-medium">
            <dt className="text-gray-900">Tracking number</dt>
            <dd className="mt-2 text-indigo-600">51547878755545848512</dd>
          </dl>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <h2 className="sr-only">Your order</h2>

          <h3 className="sr-only">Items</h3>
          <div
            key={transaction?.product?.productId}
            className="flex space-x-6 border-b border-gray-200 py-10"
          >
            <img
              alt={transaction?.product?.productName}
              src={transaction?.product?.imageUrl}
              className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
            />
            <div className="flex flex-auto flex-col">
              <div>
                <h4 className="font-medium text-gray-900">
                  <a href={`products/${transaction?.product?.productId}`}>
                    {transaction?.product?.productName}
                  </a>
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  {transaction?.product?.productDescription}
                </p>
              </div>
              <div className="mt-6 flex flex-1 items-end">
                <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                  <div className="flex">
                    <dt className="font-medium text-gray-900">Quantity</dt>
                    <dd className="ml-2 text-gray-700">
                      {transaction?.numberUnits}
                    </dd>
                  </div>
                  <div className="flex pl-4 sm:pl-6">
                    <dt className="font-medium text-gray-900">Price</dt>
                    <dd className="ml-2 text-gray-700">
                      {formatPrice(transaction?.product?.unitPrice ?? 0)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Your information</h3>

            <h4 className="sr-only">Addresses</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Shipping address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{transaction?.delivery?.city}</span>
                    <span className="block">
                      {transaction?.delivery?.address}
                    </span>
                    <span className="block">
                      {transaction?.delivery?.city},{' '}
                      {transaction?.delivery?.zipCode}
                    </span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{transaction?.delivery?.city}</span>
                    <span className="block">
                      {transaction?.delivery?.address}
                    </span>
                    <span className="block">
                      {transaction?.delivery?.city},{' '}
                      {transaction?.delivery?.zipCode}
                    </span>
                  </address>
                </dd>
              </div>
            </dl>

            <h4 className="sr-only">Payment</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Payment method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>Card</p>
                  <p>{transaction?.card?.type}</p>
                  <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>
                    {transaction?.card?.number}
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Shipping method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>DHL</p>
                  <p>Takes up to 3 working days</p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700">
                  {formatPrice(transaction?.amount ?? 0)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">
                  {formatPrice(transaction?.amount ?? 0)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
