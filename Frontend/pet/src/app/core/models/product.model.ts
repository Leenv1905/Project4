export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  // originalPrice?: number;        // Giá gốc (nếu có khuyến mãi)

  images: string[];              // Mảng ảnh (ít nhất 1 ảnh)
  video?: string;                // Link video nếu có

  status: 'available' | 'sold' | 'reserved' | 'not_for_sale';

  species: 'Chó' | 'Mèo' | 'Khác';   // Loài
  breed: string;                     // Giống (Poodle, Husky, ...)
  color: string;                     // Màu lông
  gender: 'male' | 'female';         // Giới tính
  weight: number;                    // Cân nặng (kg) - thay cho dogType cũ

  age?: number;                      // Tuổi (tháng) (SAU THAY BẰNG birth_of_date)
  // birth_of_date?: Date;               // Ngày sinh
  vaccinated: boolean;               // Đã tiêm vaccine chưa
  neutered: boolean;                 // Đã triệt sản chưa

  shopId: number;
  shopName: string;

  createdAt: Date;
  updatedAt?: Date;
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
