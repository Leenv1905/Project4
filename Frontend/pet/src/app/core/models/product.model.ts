export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  // originalPrice?: number;        // Giá gốc (nếu có khuyến mãi)

  petCode?: string;
  images: string[];              // Mảng ảnh (ít nhất 1 ảnh)
  video?: string;                // Link video nếu có

  status: string;

  species: string;                   // 'DOG', 'CAT', 'OTHER' ...
  breed: string;                     // Giống (Poodle, Husky, ...)
  color: string;                     // Màu lông
  gender: string;                    // Giới tính
  weight: number;                    // Cân nặng (kg)

  age?: number;                      // Tuổi (tháng)
  vaccinated: boolean;               // Đã tiêm vaccine chưa
  neutered: boolean;                 // Đã triệt sản chưa

  shopId: number;
  shopName: string;

  createdAt: Date;
  updatedAt?: Date;
  isVerified?: boolean;
  trustScore?: number;
  isHealthVerified?: boolean;
  isPedigreeVerified?: boolean;
}

// export interface Product {
//
//   id: number;
//
//   name: string;
//
//   description: string;
//
//   price: number;
//
//   images: string[];
//
//   video?: string;
//
//   breed: string;
//
//   dogType: string;
//
//   shopName: string;
//
// }
