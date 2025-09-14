export interface FeatureFlag {
  id: number;
  name: string;
  enabled: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlagRequest {
  name: string;
  enabled: boolean;
  description?: string;
}

export interface UpdateFlagRequest {
  name: string;
  enabled: boolean;
  description?: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}
