import { createSlice } from '@reduxjs/toolkit';

/**
 * Example Feature Slice
 * 
 * This is a reference implementation showing Redux Toolkit slice patterns.
 * Use this as a template for creating new feature slices.
 * 
 * @see https://redux-toolkit.js.org/api/createSlice
 */

const initialState = {
  counter: 0,
  loading: false,
  error: null,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    // Synchronous actions
    increment: (state) => {
      state.counter += 1;
    },
    decrement: (state) => {
      state.counter -= 1;
    },
    reset: (state) => {
      state.counter = 0;
    },
    setValue: (state, action) => {
      state.counter = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  // extraReducers can be used here for handling async thunks
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(someAsyncThunk.pending, (state) => {
  //       state.loading = true;
  //     })
  //     .addCase(someAsyncThunk.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.data = action.payload;
  //     })
  //     .addCase(someAsyncThunk.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message;
  //     });
  // },
});

// Export actions for use in components
export const { increment, decrement, reset, setValue, setLoading, setError } = exampleSlice.actions;

// Selectors
export const selectCounter = (state) => state.example.counter;
export const selectLoading = (state) => state.example.loading;
export const selectError = (state) => state.example.error;

// Export reducer for store configuration
export default exampleSlice.reducer;
