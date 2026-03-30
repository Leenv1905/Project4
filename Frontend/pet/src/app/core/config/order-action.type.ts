export type OrderAction =
  | 'shop_confirm'
  | 'operator_receive'
  | 'operator_start_delivery'
  | 'operator_complete'
  | 'operator_cancel_delivery'
  | 'operator_confirm_return'
  | 'shop_confirm_return'
  | 'user_confirm_received';
