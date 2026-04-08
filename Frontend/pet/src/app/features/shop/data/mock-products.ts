import { Product } from '../../../core/models/product.model';

const breeds = ['Poodle', 'Corgi', 'Husky', 'Golden Retriever', 'Pomeranian', 'British Shorthair', 'Scottish Fold'];
const colors = ['Trắng', 'Đen', 'Vàng', 'Xám', 'Nâu', 'Bicolor'];
const speciesList: ('Chó' | 'Mèo')[] = ['Chó', 'Mèo'];

// Danh sách ảnh mẫu (bạn có thể thêm nhiều ảnh hơn)
const imagePool = [
  '/assets/cho1.jpg',
  '/assets/cho2.jpg',
  '/assets/cho3.jpg',
  '/assets/cho4.jpg',
  '/assets/cho5.jpg',
  '/assets/cho6.jpeg',
  '/assets/cho7.jpeg',
  '/assets/cho8.jpeg',
  '/assets/cho9.jpeg',
  '/assets/cho1.jpg',
  '/assets/cho2.jpg',
];

export function generateMockProducts(count: number = 20): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const species = speciesList[i % 2];
    const breed = breeds[i % breeds.length];
    const color = colors[i % colors.length];

    // Tạo 3-5 ảnh ngẫu nhiên cho mỗi sản phẩm
    const numImages = 3 + Math.floor(Math.random() * 3); // 3 đến 5 ảnh
    const images = Array.from({ length: numImages }, () => {
      return imagePool[Math.floor(Math.random() * imagePool.length)];
    });

    return {
      id: i + 1,
      name: `${species} ${breed} ${i + 1}`,
      description: `Thú cưng thuần chủng ${breed}, lông màu ${color.toLowerCase()}, sức khỏe tốt, đã tiêm vaccine cơ bản. Tính tình vui vẻ, dễ gần.`,
      price: 3500000 + Math.floor(Math.random() * 12000000),
      originalPrice: Math.random() > 0.65 ? 3500000 + Math.floor(Math.random() * 15000000) : undefined,
      images: images,                    // ← Nhiều ảnh
      video: undefined,
      status: Math.random() > 0.85 ? 'sold' : 'available',
      species: species,
      breed: breed,
      color: color,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      weight: Number((2.5 + Math.random() * 15).toFixed(1)),
      age: Math.floor(Math.random() * 18) + 3,
      vaccinated: Math.random() > 0.15,
      neutered: Math.random() > 0.35,
      shopId: (i % 3) + 1,
      shopName: `Pet Shop ${(i % 3) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000)
    };
  });
}

// Export mảng tĩnh nếu cần dùng ở nhiều nơi
export const MOCK_PRODUCTS: Product[] = generateMockProducts(30);


// import { Product } from '../../../core/models/product.model';
//
// export const MOCK_PRODUCTS: Product[] = [
//   {
//     id: 1,
//     name: "Chó Poodle Mini Trắng",
//     description: "Poodle Mini thuần chủng, lông trắng mềm mượt, tính tình vui vẻ, thông minh. Đã tiêm đầy đủ vaccine và triệt sản.",
//     price: 8500000,
//     // originalPrice: 9500000,
//     images: [
//       '/assets/pets/poodle-white-1.jpg',
//       '/assets/pets/poodle-white-2.jpg',
//       '/assets/pets/poodle-white-3.jpg'
//     ],
//     status: 'available',
//     species: 'Chó',
//     breed: 'Poodle',
//     color: 'Trắng',
//     gender: 'male',
//     weight: 4.2,
//     age: 5,
//     vaccinated: true,
//     neutered: true,
//     shopId: 1,
//     shopName: 'Pet Kingdom',
//     createdAt: new Date('2025-03-15')
//   },
//   {
//     id: 2,
//     name: "Chó Husky Siberia Xám",
//     description: "Husky thuần chủng, mắt xanh đẹp, lông dày, rất năng động và thích hợp với khí hậu mát.",
//     price: 12500000,
//     images: [
//       '/assets/pets/husky-gray-1.jpg',
//       '/assets/pets/husky-gray-2.jpg'
//     ],
//     status: 'available',
//     species: 'Chó',
//     breed: 'Husky',
//     color: 'Xám',
//     gender: 'female',
//     weight: 18.5,
//     age: 8,
//     vaccinated: true,
//     neutered: false,
//     shopId: 2,
//     shopName: 'Snow Pet',
//     createdAt: new Date('2025-04-01')
//   },
//   {
//     id: 3,
//     name: "Mèo Anh lông ngắn màu Bicolor",
//     description: "Mèo Anh lông ngắn thuần chủng, tính tình điềm đạm, dễ gần, rất phù hợp làm thú cưng gia đình.",
//     price: 4500000,
//     // originalPrice: 5200000,
//     images: ['/assets/pets/british-bicolor.jpg'],
//     status: 'available',
//     species: 'Mèo',
//     breed: 'British Shorthair',
//     color: 'Bicolor',
//     gender: 'male',
//     weight: 3.8,
//     age: 6,
//     vaccinated: true,
//     neutered: true,
//     shopId: 1,
//     shopName: 'Pet Kingdom',
//     createdAt: new Date('2025-03-20')
//   },
//   // ... bạn có thể thêm tiếp 17 con nữa theo mẫu này
// ];
//
// // Hàm helper để tạo nhiều mock nhanh
// // export function generateMockProducts(count: number = 20): Product[] {
//   const breeds = ['Poodle', 'Corgi', 'Husky', 'Golden Retriever', 'Pomeranian', 'British Shorthair', 'Scottish Fold'];
//   const colors = ['Trắng', 'Đen', 'Vàng', 'Xám', 'Nâu', 'Bicolor'];
//   const speciesList: ('Chó' | 'Mèo')[] = ['Chó', 'Mèo'];
//
// // Danh sách ảnh mẫu (bạn có thể thêm nhiều ảnh hơn)
//   const imagePool = [
//     '/assets/pets/cho1.jpg',
//     '/assets/pets/cho2.jpg',
//     '/assets/pets/cho3.jpg',
//     '/assets/pets/cho4.jpg',
//     '/assets/pets/cho5.jpg',
//     '/assets/pets/meo1.jpg',
//     '/assets/pets/meo2.jpg',
//     '/assets/pets/meo3.jpg',
//     '/assets/pets/poodle-white-1.jpg',
//     '/assets/pets/husky-gray-1.jpg',
//     '/assets/pets/british-bicolor.jpg'
//   ];
//   export function generateMockProducts(count: number = 20): Product[] {
//     return Array.from({ length: count }, (_, i) => {
//       const species = speciesList[i % 2];
//       const breed = breeds[i % breeds.length];
//       const color = colors[i % colors.length];
//
//       // Tạo 3-5 ảnh ngẫu nhiên cho mỗi sản phẩm
//       const numImages = 3 + Math.floor(Math.random() * 3); // 3 đến 5 ảnh
//       const images = Array.from({ length: numImages }, () => {
//         return imagePool[Math.floor(Math.random() * imagePool.length)];
//       });
//
//       return {
//         id: i + 1,
//         name: `${species} ${breed} ${i + 1}`,
//         description: `Thú cưng thuần chủng ${breed}, lông màu ${color.toLowerCase()}, sức khỏe tốt, đã tiêm vaccine cơ bản. Tính tình vui vẻ, dễ gần.`,
//         price: 3500000 + Math.floor(Math.random() * 12000000),
//         originalPrice: Math.random() > 0.65 ? 3500000 + Math.floor(Math.random() * 15000000) : undefined,
//         images: images,                    // ← Nhiều ảnh
//         video: undefined,
//         status: Math.random() > 0.85 ? 'sold' : 'available',
//         species: species,
//         breed: breed,
//         color: color,
//         gender: Math.random() > 0.5 ? 'male' : 'female',
//         weight: Number((2.5 + Math.random() * 15).toFixed(1)),
//         age: Math.floor(Math.random() * 18) + 3,
//         vaccinated: Math.random() > 0.15,
//         neutered: Math.random() > 0.35,
//         shopId: (i % 3) + 1,
//         shopName: `Pet Shop ${(i % 3) + 1}`,
//         createdAt: new Date(Date.now() - Math.random() * 10000000000)
//       };
//     });
//   }
//
// // Export mảng tĩnh nếu cần dùng ở nhiều nơi
//   export const MOCK_PRODUCTS: Product[] = generateMockProducts(30);
//
// //
// //
// //   return Array.from({ length: count }, (_, i) => {
// //     const species = speciesList[i % 2];
// //     return {
// //       id: i + 1,
// //       name: `${species} ${breeds[i % breeds.length]} ${i + 1}`,
// //       description: `Thú cưng thuần chủng, sức khỏe tốt, đã tiêm vaccine cơ bản. Tính tình vui vẻ, dễ gần.`,
// //       price: 3500000 + Math.floor(Math.random() * 12000000),
// //       // images: [`/assets/pets/pet-${(i % 8) + 1}.jpg`],
// //       // images: [`/assets/cho1.jpg`, `/assets/cho2.jpg`],
// //       images: [`/assets/cho1.jpg`],
// //       status: Math.random() > 0.85 ? 'sold' : 'available',
// //       species: species,
// //       breed: breeds[i % breeds.length],
// //       color: colors[i % colors.length],
// //       gender: Math.random() > 0.5 ? 'male' : 'female',
// //       weight: 2.5 + Math.random() * 15,
// //       age: Math.floor(Math.random() * 18) + 3,
// //       vaccinated: Math.random() > 0.2,
// //       neutered: Math.random() > 0.4,
// //       shopId: (i % 3) + 1,
// //       shopName: `Pet Shop ${ (i % 3) + 1 }`,
// //       createdAt: new Date(Date.now() - Math.random() * 10000000000)
// //     };
// //   });
// // }
//
// // import { ShopProduct } from '../models/shop-product.model';
// //
// // const breeds = ['Poodle', 'Corgi', 'Husky', 'Golden', 'Pomeranian'];
// // const types = ['Tiny', 'Mini', 'Standard'];
// //
// // export const MOCK_PRODUCTS: ShopProduct[] = Array.from({ length: 20 }).map((_, i) => ({
// //   id: i + 1,
// //   name: `Chó ${breeds[i % breeds.length]} ${i + 1}`,
// //   price: 3000000 + i * 300000,
// //   // image: `/assets/demo/dog-${(i % 5) + 1}.jpg`,
// //   // image: [`/assets/cho1.jpg`, `/assets/cho2.jpg`, `/assets/cho3.jpg`][i % 3],
// //   image: `/assets/cho1.jpg`,
// //   breed: breeds[i % breeds.length],
// //   dogType: types[i % types.length],
// //   shopName: `Pet Shop ${i + 1}`
// // }));
