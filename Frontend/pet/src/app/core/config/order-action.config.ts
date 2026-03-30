import { Order } from '../models/order.model';
import { OrderAction } from './order-action.type';

export interface ActionConfig {
  canExecute: (order: Order) => boolean;
  execute: (order: Order) => Order;
}

export const ORDER_ACTIONS: Record<OrderAction, ActionConfig> = {

  // ===== SHOP =====
  shop_confirm: {
    canExecute: (o) => o.status === 'pending',
    execute: (o) => ({
      ...o,
      status: 'confirmed',
      fulfillmentStatus: 'pending'
    })
  },
  shop_confirm_return: {
    canExecute: (o) => o.fulfillmentStatus === 'return_pending',
    execute: (o) => ({
      ...o,
      fulfillmentStatus: 'returned',
      status: 'confirmed' // quay lại shop
    })
  },

  // ===== OPERATOR =====
  operator_receive: {
    canExecute: (o) => o.fulfillmentStatus === 'pending',
    execute: (o) => ({
      ...o,
      fulfillmentStatus: 'received'
    })
  },

  operator_start_delivery: {
    canExecute: (o) => o.fulfillmentStatus === 'received',
    execute: (o) => ({
      ...o,
      fulfillmentStatus: 'delivering',
      status: 'shipping'
    })
  },

  operator_complete: {
    canExecute: (o) => o.fulfillmentStatus === 'delivering',
    execute: (o) => ({
      ...o,
      fulfillmentStatus: 'delivered',
      status: 'shipping' // 👈 chưa completed
    })
  },

  operator_cancel_delivery: {
    canExecute: (o) => o.fulfillmentStatus === 'delivering',
    execute: (o) => ({
      ...o,
      fulfillmentStatus: 'return_pending'
    })
  },

  operator_confirm_return: {
    canExecute: (o) => o.fulfillmentStatus === 'return_pending',
    execute: (o) => ({
      ...o,
      fulfillmentStatus: 'returned',
      status: 'confirmed'
    })
  },

  // ===== USER =====
  user_confirm_received: {
    canExecute: (o) =>
      o.status === 'shipping' &&
      o.fulfillmentStatus === 'delivered',

    execute: (o) => ({
      ...o,
      status: 'completed'
    })
  }

};
