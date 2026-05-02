export interface PetImageDTO {
  imageUrl?: string;
  originalImageUrl?: string;
  isAiProcessed: boolean;
  aiRenderedUrl?: string;
  aiPrompt?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface PetRequest {
  petCode: string;
  name: string;
  species: string;
  breed: string;
  description: string;
  price?: number;
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
  images: PetImageDTO[];
}
