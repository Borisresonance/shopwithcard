'use client';

import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Card, Customer, Delivery, Transaction } from '../models';
import Cards from 'react-credit-cards-2';

import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { formatPrice } from '../../shared/formatPrice.ts';
import { Product } from '../../products/models/Product.ts';
import { createFetchTransactionRepository } from '../../lib/Transaction/infraestructure/FetchProductRepository.ts';
import { createTransactionService } from '../../lib/Transaction/application/TransactionService.ts';
import { useNavigate } from 'react-router-dom';

interface PurchaseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  products: Product[];
}

type Focused = 'name' | 'number' | 'expiry' | 'cvc' | '';
export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  setOpen,
  products,
}) => {
  const [card, setCard] = useState<Card>({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder: '',
    installments: 1,
    type: '',
  } as Card);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
  } as Customer);
  const [delivery, setDelivery] = useState<Delivery>({
    city: '',
    zipCode: '',
    address: '',
    state: '',
  } as Delivery);
  const [expiry, setExpiry] = useState('');
  const [focus, setFocus] = useState<Focused>('name');
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    if (name === 'expiry') {
      let newValue = value.replace(/[^\d\\/]/g, '');

      if (newValue.includes('/')) {
        const parts = newValue.split('/');
        newValue = parts[0] + (parts[1] ? '/' + parts[1].slice(0, 2) : '');
      }

      if (newValue.length > 2 && !newValue.includes('/')) {
        newValue = newValue.slice(0, 2) + '/' + newValue.slice(2, 4);
      }

      if (newValue.length > 5) {
        newValue = newValue.slice(0, 5);
      }

      setExpiry(newValue);
      // split / and get month and year
      const parts = newValue.split('/');
      setCard((prev) => ({ ...prev, exp_month: parts[0], exp_year: parts[1] }));
      return;
    }
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFocus(evt.target.name as Focused);
  };

  const handleCustomerChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setDelivery((prev) => ({ ...prev, [name]: value }));
  };
  const getSubtotal = () =>
    products.reduce(
      (acc, product) => acc + product.unitPrice * (product.unitsOnOrder ?? 1),
      0,
    );

  const getSubtotalFormated = () => {
    return formatPrice(getSubtotal());
  };

  const handlePayment = async () => {
    setPending(true);
    const repository = createFetchTransactionRepository();
    const service = createTransactionService(repository);
    const transaction: Transaction = {
      amount: getSubtotal(),
      productId: products[0].productId,
      numberUnits: products[0].unitsOnOrder ?? 1,
      card: card,
      delivery: delivery,
      customer: customer,
      date: new Date(),
    };
    const transactionID = await service.createTransaction(transaction);
    setPending(false);
    setOpen(false);
    navigate(`/resume/${transactionID}`);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-5xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <main className="lg:flex lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
              <h2 className="sr-only">Checkout</h2>

              {/* Mobile order summary */}
              <section
                aria-labelledby="order-heading"
                className="bg-gray-50 px-4 py-6 sm:px-6 lg:hidden"
              >
                <Disclosure as="div" className="mx-auto max-w-lg">
                  <div className="flex items-center justify-between">
                    <h2
                      id="order-heading"
                      className="text-lg font-medium text-gray-900"
                    >
                      Your Order
                    </h2>
                    <DisclosureButton className="group font-medium text-indigo-600 hover:text-indigo-500">
                      <span className="[.group:not([data-open])_&]:hidden">
                        Hide full summary
                      </span>
                      <span className="group-data-[open]:hidden">
                        Show full summary
                      </span>
                    </DisclosureButton>
                  </div>

                  <DisclosurePanel>
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 border-b border-gray-200"
                    >
                      {products.map((product) => (
                        <li
                          key={product.productId}
                          className="flex space-x-6 py-6"
                        >
                          <img
                            alt={product.productName}
                            src={product.imageUrl}
                            className="h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center"
                          />
                          <div className="flex flex-col justify-between space-y-4">
                            <div className="space-y-1 text-sm font-medium">
                              <h3 className="text-gray-900">
                                {product.productName}
                              </h3>
                              <p className="text-gray-900">
                                {formatPrice(product.unitPrice)}
                              </p>
                              <p className="text-gray-500">
                                Units: {product.unitsOnOrder}
                              </p>
                            </div>
                            <div className="flex space-x-4">
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Edit
                              </button>
                              <div className="flex border-l border-gray-300 pl-4">
                                <button
                                  type="button"
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                      <div className="flex justify-between">
                        <dt>Subtotal</dt>
                        <dd className="text-gray-900">
                          {getSubtotalFormated()}
                        </dd>
                      </div>
                    </dl>
                  </DisclosurePanel>

                  <p className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-900">
                    <span className="text-base">Total</span>
                    <span className="text-base">{getSubtotalFormated()}</span>
                  </p>
                </Disclosure>
              </section>

              {/* Order summary */}
              <section
                aria-labelledby="summary-heading"
                className="hidden w-full max-w-md h-auto flex-col bg-gray-50 lg:flex"
              >
                <h2 id="summary-heading" className="sr-only">
                  Order summary
                </h2>

                <ul
                  role="list"
                  className="flex-auto divide-y divide-gray-200 overflow-y-auto px-5"
                >
                  {products.map((product) => (
                    <li key={product.productId} className="flex space-x-6 py-6">
                      <img
                        alt={product.productName}
                        src={product.imageUrl}
                        className="h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center"
                      />
                      <div className="flex flex-col justify-between space-y-4">
                        <div className="space-y-1 text-sm font-medium">
                          <h3 className="text-gray-900">
                            {product.productName}
                          </h3>
                          <p className="text-gray-900">
                            {formatPrice(product.unitPrice)}
                          </p>
                          <p className="text-gray-500">
                            Units: {product.unitsOnOrder}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
                  <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="text-gray-900">{getSubtotalFormated()}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                      <dt className="text-base">Total</dt>
                      <dd className="text-base">{getSubtotalFormated()}</dd>
                    </div>
                  </dl>
                </div>
              </section>

              {/* Checkout form */}
              <section
                aria-labelledby="payment-heading"
                className="flex-auto overflow-y-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-10 lg:pt-0"
              >
                <Cards
                  number={card.number}
                  expiry={expiry}
                  cvc={card.cvc}
                  name={card.card_holder}
                  focused={focus}
                />
                <div className="mx-auto max-w-lg">
                  <div className="mt-4">
                    <div className="grid grid-cols-12 gap-x-4 gap-y-3">
                      <div className="col-span-full">
                        <label
                          htmlFor="card_holder"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name on card
                        </label>
                        <div className="mt-1">
                          <input
                            id="card_holder"
                            name="card_holder"
                            type="text"
                            autoComplete="cc-name"
                            value={card.card_holder}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Card number
                        </label>
                        <div className="mt-1">
                          <input
                            id="number"
                            name="number"
                            type="text"
                            value={card.number}
                            autoComplete="cc-number"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-8 sm:col-span-9">
                        <label
                          htmlFor="expiry"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration date (MM/YY)
                        </label>
                        <div className="mt-1">
                          <input
                            id="expiry"
                            name="expiry"
                            type="text"
                            max={5}
                            maxLength={5}
                            autoComplete="cc-exp"
                            value={expiry}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-4 sm:col-span-3">
                        <label
                          htmlFor="cvc"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CVC
                        </label>
                        <div className="mt-1">
                          <input
                            id="cvc"
                            name="cvc"
                            type="text"
                            value={card.cvc}
                            maxLength={4}
                            max={4}
                            autoComplete="csc"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-6">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={customer.email}
                            onChange={handleCustomerChange}
                            autoComplete="email"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-6">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full name
                        </label>
                        <div className="mt-1">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={customer.name}
                            onChange={handleCustomerChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-8">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={delivery.address}
                            onChange={handleDeliveryChange}
                            autoComplete="street-address"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-4">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={customer.phone}
                            onChange={handleCustomerChange}
                            autoComplete="tel"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-4">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={delivery.city}
                            onChange={handleDeliveryChange}
                            autoComplete="address-level2"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-4">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State / Province
                        </label>
                        <div className="mt-1">
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={delivery.state}
                            onChange={handleDeliveryChange}
                            autoComplete="address-level1"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-4">
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={delivery.zipCode}
                            onChange={handleDeliveryChange}
                            autoComplete="postal-code"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <div className="flex h-5 items-center">
                        <input
                          defaultChecked
                          id="same-as-shipping"
                          name="same-as-shipping"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <label
                        htmlFor="same-as-shipping"
                        className="text-sm font-medium text-gray-900"
                      >
                        Billing address is the same as shipping address
                      </label>
                    </div>

                    {pending ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 cursor-not-allowed"
                        disabled
                      >
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={() => handlePayment()}
                        className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Pay {getSubtotalFormated()}
                      </button>
                    )}

                    <p className="mt-6 flex justify-center text-sm font-medium text-gray-500">
                      <LockClosedIcon
                        aria-hidden="true"
                        className="mr-1.5 h-5 w-5 text-gray-400"
                      />
                      Payment details stored in plain text
                    </p>
                  </div>
                </div>
              </section>
            </main>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
