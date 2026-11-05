import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiError } from '@/lib/api-client';
import {
  SuperAdminCompany,
  SuperAdminCompanyDetail,
  SuperAdminCompanyListParams,
  SuperAdminCompanyListResponse,
  superAdminCompanyService,
} from '@/services/superadminCompany.service';
import type { RootState } from '@/redux/reducer/rootReducer';

interface SuperAdminCompanyState {
  companies: SuperAdminCompany[];
  currentCompany: SuperAdminCompanyDetail | null;
  pagination: SuperAdminCompanyListResponse['pagination'];
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
}

const initialState: SuperAdminCompanyState = {
  companies: [],
  currentCompany: null,
  pagination: { total: 0, page: 1, pageCount: 0 },
  isLoading: false,
  isDetailLoading: false,
  error: null,
};

export const fetchSuperAdminCompanyList = createAsyncThunk(
  'superAdminCompany/fetchList',
  async (params: SuperAdminCompanyListParams, { rejectWithValue }) => {
    try {
      return await superAdminCompanyService.getCompanyList(params);
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to fetch company listing');
      return rejectWithValue(apiError.message);
    }
  }
);

export const fetchSuperAdminCompanyById = createAsyncThunk(
  'superAdminCompany/fetchById',
  async (companyId: string, { rejectWithValue }) => {
    try {
      return await superAdminCompanyService.getCompanyById(companyId);
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to fetch company details');
      return rejectWithValue(apiError.message);
    }
  }
);

const superAdminCompanySlice = createSlice({
  name: 'superAdminCompany',
  initialState,
  reducers: {
    clearSuperAdminCompanyError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSuperAdminCompanyList.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSuperAdminCompanyList.fulfilled,
        (state, action: PayloadAction<SuperAdminCompanyListResponse>) => {
          state.companies = action.payload.companies;
          state.pagination = action.payload.pagination;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(fetchSuperAdminCompanyList.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Failed to fetch company listing';
      })
      .addCase(fetchSuperAdminCompanyById.pending, state => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSuperAdminCompanyById.fulfilled,
        (state, action: PayloadAction<SuperAdminCompanyDetail>) => {
          state.currentCompany = action.payload;
          state.isDetailLoading = false;
          state.error = null;
        }
      )
      .addCase(fetchSuperAdminCompanyById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error =
          (action.payload as string) || 'Failed to fetch company details';
      });
  },
});

export const { clearSuperAdminCompanyError } = superAdminCompanySlice.actions;
export const selectSuperAdminCompanyState = (state: RootState) =>
  state.superAdminCompany;
export default superAdminCompanySlice.reducer;
