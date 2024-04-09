export interface VlmResponse<T> {
  message: string;
  data: T;
}

export interface VlmError {
  error_code: string;
  message: string;
  details: string | null;
}

export function isVlmError(response: any): response is VlmError {
  return response?.error_code && response?.message;
}
