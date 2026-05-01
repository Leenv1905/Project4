export type OrderStatus =
  | 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled'
  | 'created' | 'shop_confirmed' | 'warehouse_received'
  | 'inspection_passed' | 'inspection_failed'
  | 'delivery_started' | 'delivery_completed' | 'delivery_failed'
  | 'customer_confirmed';

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export type FulfillmentStatus = string;

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  fulfillmentStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: Date;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
}
