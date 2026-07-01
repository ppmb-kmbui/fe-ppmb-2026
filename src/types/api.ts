export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string | ValidationError[] | unknown[];
  data?: T;
  status?: number;
}
