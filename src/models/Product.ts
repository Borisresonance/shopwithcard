export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  imageUrl: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder?: number;
}
