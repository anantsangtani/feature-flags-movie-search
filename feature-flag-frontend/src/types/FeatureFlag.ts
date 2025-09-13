export interface FeatureFlag {
  id?: number;
  name: string;
  enabled: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureFlagRequest {
  name: string;
  enabled: boolean;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}