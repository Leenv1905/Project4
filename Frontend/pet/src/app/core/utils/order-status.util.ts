// HELPER DÙNG CHUNG
import { ORDER_STATUS_CONFIG } from '../constants/order-status.constant';
import {Order} from '../models/order.model';

export function getStatusLabel(status: string): string {
  return ORDER_STATUS_CONFIG.find(s => s.key === status)?.label || status;
}

export function getStatusColor(status: string): string {
  return ORDER_STATUS_CONFIG.find(s => s.key === status)?.color || 'black';
}

export function getDisplayStatus(order: Order): string {

  if (order.fulfillmentStatus === 'return_pending') {
    return 'Đang hoàn hàng';
  }

  if (order.fulfillmentStatus === 'returned') {
    return 'Đã hoàn';
  }

  if (order.status === 'completed') {
    return 'Hoàn tất';
  }

  if (order.status === 'shipping') {
    return 'Đang giao';
  }

  if (order.status === 'confirmed') {
    return 'Đã xác nhận';
  }

  return 'Đang chờ';
}
