export interface ShopFilter {

  sort?: 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';

  breed?: string;        // Poodle, Corgi...
  dogType?: string;      // Tiny, Mini, Standard

  priceRange?: 'low' | 'medium' | 'high';

  searchQuery?: string;

  shopName?: string;     // filter theo shop (optional)

}
