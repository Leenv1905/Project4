// HELPER DÙNG CHUNG
import { ORDER_STATUS_CONFIG } from '../constants/order-status.constant';

export function getStatusLabel(status: string): string {
  return ORDER_STATUS_CONFIG.find(s => s.key === status)?.label || status;
}

export function getStatusColor(status: string): string {
  return ORDER_STATUS_CONFIG.find(s => s.key === status)?.color || 'black';
}
