import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChats, sendMessage } from "../../services/api";
import type { ChatMessage } from "../../types";
import type { RootState } from "../../app/store";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isSending: boolean;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isSending: false,
};

export const loadMessages = createAsyncThunk<
  ChatMessage[],
  void,
  { state: RootState; rejectValue: string }
>("chat/loadMessages", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    if (!token) {
      return rejectWithValue("Пользователь не авторизован");
    }
    return await fetchChats(token);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка загрузки сообщений";
    return rejectWithValue(message);
  }
});

export const postMessage = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>("chat/postMessage", async (body, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.user?.token;
    if (!token) {
      return rejectWithValue("Пользователь не авторизован");
    }
    await sendMessage(token, { body });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка отправки сообщения";
    return rejectWithValue(message);
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearMessages(state) {
      state.messages = [];
    },
    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Неизвестная ошибка";
      })
      .addCase(postMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(postMessage.fulfilled, (state) => {
        state.isSending = false;
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload ?? "Неизвестная ошибка";
      });
  },
});

export const { clearMessages, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;
