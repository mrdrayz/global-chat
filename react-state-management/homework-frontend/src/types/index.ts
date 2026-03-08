export interface User {
  username: string;
  token: string;
}

export interface ChatMessage {
  username: string;
  body: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface SendMessageRequest {
  body: string;
}

export interface SendMessageResponse {
  message: string;
}
