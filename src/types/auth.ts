
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface HistoryItem {
  id: string;
  type: 'audio' | 'video' | 'text' | 'image';
  input: string;
  output: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}
