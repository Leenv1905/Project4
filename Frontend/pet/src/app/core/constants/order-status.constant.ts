// STATUS CHUẨN DÙNG CHUNG
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUS_CONFIG = [
  { key: 'pending', label: 'Đang chờ', color: 'orange' },
  { key: 'confirmed', label: 'Đã xác nhận', color: 'blue' },
  { key: 'shipping', label: 'Đang giao', color: 'purple' },
  { key: 'delivered', label: 'Đã nhận', color: 'green' },
  { key: 'cancelled', label: 'Hủy', color: 'red' }
] as const;
