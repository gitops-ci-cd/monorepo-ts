export interface User {
  id: string;
  name: string;
  language?: string;
}

export interface HelloResponse {
  greeting: string;
  user: User;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
}
