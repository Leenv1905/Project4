export interface Product {
  id: number;petCode?: string;
  name: string;
  description: string;
  price: number;

  images: string[];

  imageUrl?: string; // 👈 thêm dòng này (ảnh chính)

  video?: string;

  status: 'available' | 'sold' | 'reserved' | 'not_for_sale';

  species: 'Chó' | 'Mèo' | 'Khác';
  breed: string;
  color: string;
  gender: 'male' | 'female';
  weight: number;

  age?: number;
  vaccinated: boolean;
  neutered: boolean;

  shopId: number;
  shopName: string;

  createdAt: Date;
  updatedAt?: Date;
  isVerified?: boolean;
  trustScore?: number;
  isHealthVerified?: boolean;
  isPedigreeVerified?: boolean;
}
