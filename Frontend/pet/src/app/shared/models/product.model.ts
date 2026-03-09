export interface Product {
  id: number;
  name: string;
  author?: string;
  price: number;
  salePrice?: number;
  rating?: number;
  discount?: string;
  image: string;
}
