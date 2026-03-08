import { logger } from "./logger";
import type {
  AuthRequest,
  AuthResponse,
  ChatMessage,
  RegisterResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "../types";

const BASE_URL = "http://localhost:3001";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  logger.info(`Request: ${options.method ?? "GET"} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage =
      (errorBody as { message?: string }).message ?? `HTTP ${response.status}`;
    logger.error(`Response error: ${response.status} ${endpoint}`, errorBody);
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as T;
  logger.info(`Response: ${response.status} ${endpoint}`, data);
  return data;
}

function getAuthHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function registerUser(
  credentials: AuthRequest,
): Promise<RegisterResponse> {
  return request<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function loginUser(credentials: AuthRequest): Promise<AuthResponse> {
  return request<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function fetchChats(token: string): Promise<ChatMessage[]> {
  return request<ChatMessage[]>("/chats", {
    method: "GET",
    headers: getAuthHeaders(token),
  });
}

export function sendMessage(
  token: string,
  message: SendMessageRequest,
): Promise<SendMessageResponse> {
  return request<SendMessageResponse>("/chats", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(message),
  });
}
