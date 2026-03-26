export type OrderStatus =
  | 'pending'      // user vừa đặt
  | 'confirmed'    // shop đã duyệt
  | 'shipping'     // operator giao
  | 'delivered'    // user nhận
  | 'cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
}
// export interface Order {
//
//   id?: number;
//
//   items: {
//     productId: number;
//     name: string;
//     price: number;
//     image: string;
//     quantity: number;
//     shopName: string;
//   }[];
//
//   totalAmount: number;
//
//   customerName: string;
//   phone: string;
//   address: string;
//
//   note?: string;
//
//   createdAt?: Date;
// }
