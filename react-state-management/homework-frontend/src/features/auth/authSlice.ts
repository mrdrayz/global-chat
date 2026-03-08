import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/api";
import type { AuthRequest, User } from "../../types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = "auth_user";

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as User;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

function saveUserToStorage(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function removeUserFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk<
  string,
  AuthRequest,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await registerUser(credentials);
    return response.message;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка регистрации";
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk<
  User,
  AuthRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    const user: User = {
      username: credentials.username,
      token: response.token,
    };
    saveUserToStorage(user);
    return user;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка авторизации";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      removeUserFromStorage();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Неизвестная ошибка";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Неизвестная ошибка";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
