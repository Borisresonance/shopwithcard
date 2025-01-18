export interface TransactionEntity {
  amount: number;
  productId: number;
  customer: CustomerEntity;
  card: CardEntity;
  date: Date;
  delivery: DeliveryEntity;
  numberUnits: number;
}

export interface CardEntity {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
  installments: number;
}

export interface CustomerEntity {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryEntity {
  city: string;
  address: string;
  zipCode: string;
  state: string;
}
