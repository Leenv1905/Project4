export interface Order {

  id?: number;

  items: {
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    shopName: string;
  }[];

  totalAmount: number;

  customerName: string;
  phone: string;
  address: string;

  note?: string;

  createdAt?: Date;
}
