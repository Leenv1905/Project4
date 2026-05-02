import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { PetRequest } from '../models/pet.model';
import { environment } from '../../../environments/environment';

interface PetImageApi {
  imageUrl?: string;
  objectKey?: string;
  primary?: boolean;
  displayOrder?: number;
}

interface PetApiResponse {
  id: number;
  petCode?: string;
  name?: string;
  species?: string;
  breed?: string;
  description?: string;
  price?: number;
  createdAt?: string;
  ownerId?: number;
  ownerName?: string;
  images?: PetImageApi[];
  gender?: string;
  color?: string;
  weight?: number;
  age?: number;
  status?: string;
  trustScore?: number;
  isHealthVerified?: boolean;
  isPedigreeVerified?: boolean;
  isNeutered?: boolean;
  isVaccinated?: boolean;
  isVerified?: boolean;
}

interface PetApiRequest {
  petCode?: string;
  name: string;
  species: string;
  breed: string;
  description: string;
  price: number;
  color?: string;
  gender?: string;
  weight?: number;
  age?: number;
  isVaccinated?: boolean;
  isNeutered?: boolean;
  minDailyTime?: number;
  minLivingSpace?: number;
  minActivityTime?: number;
  minMonthlyBudget?: number;
  minExperienceLevel?: number;
  images: Array<{
    imageUrl: string;
    objectKey?: string;
    isPrimary: boolean;
    displayOrder: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PetApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/pets`;
  private readonly fallbackImage = '/assets/cho1.jpg';

  // ===== CRUD Operations =====

  listAllPets(): Observable<Product[]> {
    return this.http.get<PetApiResponse[]>(this.apiUrl, { withCredentials: true }).pipe(
      map((pets) => (pets || []).map((pet) => this.mapPetToProduct(pet)))
    );
  }

  listMyPets(): Observable<Product[]> {
    return this.http.get<PetApiResponse[]>(`${this.apiUrl}/mine`, { withCredentials: true }).pipe(
      map((pets) => (pets || []).map((pet) => this.mapPetToProduct(pet)))
    );
  }

  getPetById(id: number): Observable<Product> {
    return this.http.get<PetApiResponse>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map((pet) => this.mapPetToProduct(pet))
    );
  }

  createPet(product: Partial<Product>, images: string[]): Observable<Product> {
    return this.http.post<PetApiResponse>(this.apiUrl, this.mapProductToRequest(product, images), { withCredentials: true }).pipe(
      map((pet) => this.mapPetToProduct(pet))
    );
  }

  updatePet(id: number, product: Partial<Product>, images: string[]): Observable<Product> {
    return this.http.put<PetApiResponse>(`${this.apiUrl}/${id}`, this.mapProductToRequest(product, images), { withCredentials: true }).pipe(
      map((pet) => this.mapPetToProduct(pet))
    );
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // ===== AI Image Operations =====

  /**
   * Gửi file ảnh lên để AI render bản Preview
   * @param file File ảnh gốc từ input type="file"
   * @param style Phong cách muốn render (ví dụ: 'Pixar Style', '3D Render')
   * @returns URL ảnh tạm thời từ OpenAI
   */
  renderAiPreview(file: File, style: string): Observable<{ tempAiUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', style);

    return this.http.post<{ tempAiUrl: string }>(
      `${this.apiUrl}/ai-render`,
      formData,
      { withCredentials: true }
    );
  }

  /**
   * Lưu chính thức thông tin thú cưng vào Database với PetRequest format
   * @param data Đối tượng PetRequest chứa đầy đủ petCode, thông tin mô tả và mảng images
   */
  createPetWithRequest(data: PetRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, { withCredentials: true });
  }

  /**
   * Kiểm tra số lượt dùng AI còn lại của người dùng trong ngày
   */
  getAiUsageLimit(): Observable<{ remaining: number, limit: number }> {
    return this.http.get<{ remaining: number, limit: number }>(
      `${this.apiUrl}/ai-usage-limit`,
      { withCredentials: true }
    );
  }

  // ===== Private Mappers =====

  private mapPetToProduct(pet: PetApiResponse): Product {
    const images = (pet.images || [])
      .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0))
      .map((image) => image.imageUrl)
      .filter((image): image is string => Boolean(image));

    const species = pet.species === 'Chó' || pet.species === 'Mèo' ? pet.species : 'Khác';

    const statusRaw = (pet.status || 'available').toLowerCase();
    const validStatuses = ['available', 'sold', 'pending', 'reserved', 'not_for_sale'];
    const status = (validStatuses.includes(statusRaw) ? statusRaw : 'pending') as Product['status'];

    return {
      id: Number(pet.id),
      petCode: pet.petCode,
      name: pet.name || 'Pet',
      description: pet.description || '',
      price: Number(pet.price || 0),
      images: images.length > 0 ? images : [this.fallbackImage],
      imageUrl: images.length > 0 ? images[0] : this.fallbackImage,
      status,
      species,
      breed: pet.breed || '',
      color: pet.color ?? '',
      gender: pet.gender === 'female' ? 'female' : 'male',
      weight: pet.weight ?? 0,
      age: pet.age ?? undefined,
      vaccinated: pet.isVaccinated ?? false,
      neutered: pet.isNeutered ?? false,
      shopId: Number(pet.ownerId || 0),
      shopName: pet.ownerName || 'Pet Shop',
      createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date(),
      isVerified: pet.isVerified,
      trustScore: pet.trustScore ?? undefined,
      isHealthVerified: pet.isHealthVerified ?? undefined,
      isPedigreeVerified: pet.isPedigreeVerified ?? undefined
    };
  }

  private mapProductToRequest(product: Partial<Product>, images: string[]): PetApiRequest {
    const normalizedImages = images
      .filter(Boolean)
      .map((imageUrl, index) => ({
        imageUrl,
        isPrimary: index === 0,
        displayOrder: index
      }));

    return {
      petCode: product.petCode,
      name: product.name || '',
      species: product.species || 'Chó',
      breed: product.breed || '',
      description: product.description || '',
      price: Number(product.price || 0),
      color: product.color || '',
      gender: product.gender || 'male',
      weight: product.weight ?? undefined,
      age: product.age ?? undefined,
      isVaccinated: product.vaccinated ?? false,
      isNeutered: product.neutered ?? false,
      images: normalizedImages
    };
  }
}
