import { configureStore } from "@reduxjs/toolkit";
import chatReducer, { clearMessages, clearChatError } from "./chatSlice";
import authReducer from "../auth/authSlice";

const createTestStore = () =>
  configureStore({
    reducer: {
      chat: chatReducer,
      auth: authReducer,
    },
  });

describe("chatSlice", () => {
  it("should have correct initial state", () => {
    const store = createTestStore();
    const state = store.getState().chat;

    expect(state.messages).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isSending).toBe(false);
  });

  it("should handle clearMessages", () => {
    const store = createTestStore();
    store.dispatch(clearMessages());

    const state = store.getState().chat;
    expect(state.messages).toEqual([]);
  });

  it("should handle clearChatError", () => {
    const store = createTestStore();
    store.dispatch(clearChatError());

    const state = store.getState().chat;
    expect(state.error).toBeNull();
  });
});
