// Dữ liệu mock
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  items = [
    { id: 1, name: 'The Emerald Crown', price: 2000 },
    { id: 2, name: 'The Last Enchantment', price: 29 }
  ];
}
