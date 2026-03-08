import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout, clearError } from "./authSlice";

const createTestStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe("authSlice", () => {
  it("should have correct initial state", () => {
    const store = createTestStore();
    const state = store.getState().auth;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should handle logout", () => {
    const store = createTestStore();
    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it("should handle clearError", () => {
    const store = createTestStore();
    store.dispatch(clearError());

    const state = store.getState().auth;
    expect(state.error).toBeNull();
  });
});
