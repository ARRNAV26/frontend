import { configureStore } from "@reduxjs/toolkit";

// Minimal store for now — add slices under `reducer` later.
export const store = configureStore({
  reducer: {},
});

// Convenience types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;