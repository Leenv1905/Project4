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
  { key: 'completed', label: 'HOÀN TẤT', color: 'green' }, // Hoàn tất
  { key: 'cancelled', label: 'Hủy', color: 'red' }
] as const;
