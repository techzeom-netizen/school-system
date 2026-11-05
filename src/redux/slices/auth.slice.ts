import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  authService,
  RefreshAccessTokenResponse,
} from '@/services/authService';
import { ApiError } from '@/lib/api-client';

interface AuthTokenState {
  accessToken: string | null;
  isRefreshing: boolean;
  error: string | null;
}

const initialState: AuthTokenState = {
  accessToken: localStorage.getItem('authToken'),
  isRefreshing: false,
  error: null,
};

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const storedRefreshToken =
        localStorage.getItem('refreshToken') ||
        sessionStorage.getItem('refreshToken');
      const response = await authService.refreshAccessToken(storedRefreshToken);

      localStorage.setItem('authToken', response.accessToken);
      if (response.refreshToken) {
        if (localStorage.getItem('refreshToken')) {
          localStorage.setItem('refreshToken', response.refreshToken);
        } else {
          sessionStorage.setItem('refreshToken', response.refreshToken);
        }
      }

      return response;
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to refresh access token');
      return rejectWithValue(apiError.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshAccessToken.pending, state => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(
        refreshAccessToken.fulfilled,
        (state, action: PayloadAction<RefreshAccessTokenResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.isRefreshing = false;
          state.error = null;
        }
      )
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error =
          (action.payload as string) || 'Failed to refresh access token';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
