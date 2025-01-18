import { Product } from '../../products/models/Product.ts';

export interface TransactionResponse {
  transactionId: number;
  transactionNumber: string;
  status: string;
  amount: number;
  date: Date;
  numberUnits: number;
  product: Product;
  customer: Customer;
  card: Card;
  delivery: Delivery;
}

export interface Transaction {
  amount: number;
  productId: number;
  customer: Customer;
  card: Card;
  date: Date;
  delivery: Delivery;
  numberUnits: number;
}

export interface Card {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
  installments: number;
  type: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Delivery {
  city: string;
  address: string;
  zipCode: string;
  state: string;
}
