export interface ShopFilter {
  searchQuery?: string;

  species?: 'Chó' | 'Mèo' | 'Khác';
  breed?: string;
  color?: string;
  gender?: 'male' | 'female';
  weightRange?: 'light' | 'medium' | 'heavy';

  priceRange?: 'low' | 'medium' | 'high';
  sort?: 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc' | 'newest';

  shopName?: string;
  status?: 'available' | 'sold' | 'reserved' | 'not_for_sale';
}
