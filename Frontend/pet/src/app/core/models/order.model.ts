export type OrderStatus =
  | 'pending'      // user vừa đặt
  | 'confirmed'    // shop đã duyệt
  | 'shipping'     // operator giao
  | 'completed'    // user nhận
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
  fulfillmentStatus?: FulfillmentStatus;
  createdAt: Date;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
}
// MODEL cho fulfillment (giao hàng - vận hành - operator)
export type FulfillmentStatus =
  | 'pending'            // chờ operator xử lý
  | 'received'           // đã nhận từ shop
  | 'delivering'         // đang giao
  | 'delivered'          // giao thành công
  | 'return_pending'     // hủy giao → chờ hoàn
  | 'returned';          // đã hoàn về shop
