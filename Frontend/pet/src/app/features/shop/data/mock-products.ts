import { ShopProduct } from '../models/shop-product.model';

const breeds = ['Poodle', 'Corgi', 'Husky', 'Golden', 'Pomeranian'];
const types = ['Tiny', 'Mini', 'Standard'];

export const MOCK_PRODUCTS: ShopProduct[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Chó ${breeds[i % breeds.length]} ${i + 1}`,
  price: 3000000 + i * 300000,
  // image: `/assets/demo/dog-${(i % 5) + 1}.jpg`,
  // image: [`/assets/cho1.jpg`, `/assets/cho2.jpg`, `/assets/cho3.jpg`][i % 3],
  image: `/assets/cho1.jpg`,
  breed: breeds[i % breeds.length],
  dogType: types[i % types.length],
  shopName: `Pet Shop ${i + 1}`
}));
