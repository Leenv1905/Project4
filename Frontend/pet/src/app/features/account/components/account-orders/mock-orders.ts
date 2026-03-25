import {Order} from '../../../../shared/models/order.model';

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    status: 'pending',
    totalAmount: 5000000,
    createdAt: new Date(),

    customerName: 'Nguyễn Văn A',
    phone: '0123456789',
    address: 'Hà Nội',

    items: [
      {
        productId: 1,
        name: 'Chó Poodle Tiny',
        price: 5000000,
        image: '/assets/cho1.jpg',
        quantity: 1
      }
    ]
  },
  {
    id: 2,
    status: 'shipping',
    totalAmount: 7000000,
    createdAt: new Date(),

    customerName: 'Trần Văn B',
    phone: '0987654321',
    address: 'Hồ Chí Minh',

    items: [
      {
        productId: 2,
        name: 'Chó Corgi',
        price: 7000000,
        image: '/assets/cho2.jpg',
        quantity: 1
      }
    ]
  }
];
