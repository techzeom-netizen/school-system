import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  companyService,
  Company,
  CompanyDetail,
  CreateCompanyRequest,
  CreateCompanyResponse,
  UpdateCompanyRequest,
} from '@/services/company.service';
import { ApiError } from '@/lib/api-client';
import type { RootState } from '@/redux/reducer/rootReducer';

/**
 * Company State Interface
 */
interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  companyDetail: CompanyDetail | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial State
 */
const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  companyDetail: null,
  isLoading: false,
  error: null,
};

/**
 * Async Thunks - These replace the old action creators
 */

// Get all companies
export const fetchAllCompanies = createAsyncThunk(
  'company/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const companies = await companyService.getAllCompanies();
      return companies;
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to fetch companies');
      return rejectWithValue(apiError.message);
    }
  }
);

// Get company by ID
export const fetchCompanyById = createAsyncThunk(
  'company/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const company = await companyService.getCompanyById(id);
      return company;
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to fetch company');
      return rejectWithValue(apiError.message);
    }
  }
);

// Create company
export const createCompany = createAsyncThunk(
  'company/create',
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await companyService.createCompany(data);
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to create company');
      return rejectWithValue(apiError.message);
    }
  }
);

export const getCompanyDetail = createAsyncThunk(
  'company/getDetail',
  async (_, { rejectWithValue }) => {
    try {
      return await companyService.getCompanyDetail();
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to fetch company details');
      return rejectWithValue(apiError.message);
    }
  }
);

export const resubmitCompany = createAsyncThunk(
  'company/resubmit',
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await companyService.resubmitCompany(data);
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to resubmit company details');
      return rejectWithValue(apiError.message);
    }
  }
);

// Create company from the super-admin company management screen
export const createAdminCompany = createAsyncThunk(
  'company/createAdmin',
  async (data: CreateCompanyRequest, { rejectWithValue }) => {
    try {
      return await companyService.createAdminCompany(data);
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to create company');
      return rejectWithValue(apiError.message);
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  'company/update',
  async (data: UpdateCompanyRequest, { rejectWithValue }) => {
    try {
      const company = await companyService.updateCompany(data);
      return company;
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to update company');
      return rejectWithValue(apiError.message);
    }
  }
);

// Delete company
export const deleteCompany = createAsyncThunk(
  'company/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await companyService.deleteCompany(id);
      return id;
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('Failed to delete company');
      return rejectWithValue(apiError.message);
    }
  }
);

/**
 * Company Slice - Uses Redux Toolkit's createSlice
 */
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // Clear error
    clearError: state => {
      state.error = null;
    },
    // Clear current company
    clearCurrentCompany: state => {
      state.currentCompany = null;
    },
    // Reset state (useful for logout)
    resetCompanyState: () => initialState,
  },
  extraReducers: builder => {
    // Fetch all companies
    builder
      .addCase(fetchAllCompanies.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.isLoading = false;
          state.companies = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch companies';
      });

    // Fetch company by ID
    builder
      .addCase(fetchCompanyById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyById.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.isLoading = false;
          state.currentCompany = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch company';
      });

    // Create company
    builder
      .addCase(createCompany.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createCompany.fulfilled,
        (state, _action: PayloadAction<CreateCompanyResponse>) => {
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to create company';
      });

    // Authenticated user's company details
    builder
      .addCase(getCompanyDetail.pending, state => {
        state.error = null;
      })
      .addCase(
        getCompanyDetail.fulfilled,
        (state, action: PayloadAction<CompanyDetail>) => {
          state.companyDetail = action.payload;
          state.error = null;
        }
      )
      .addCase(getCompanyDetail.rejected, (state, action) => {
        state.companyDetail = null;
        state.error =
          (action.payload as string) || 'Failed to fetch company details';
      });

    // Resubmit rejected company details
    builder
      .addCase(resubmitCompany.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resubmitCompany.fulfilled, state => {
        state.isLoading = false;
        if (state.companyDetail) state.companyDetail.status = 'pending';
        state.error = null;
      })
      .addCase(resubmitCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Failed to resubmit company details';
      });

    // Create company from super-admin
    builder
      .addCase(createAdminCompany.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createAdminCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.isLoading = false;
          state.companies.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createAdminCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to create company';
      });

    // Update company
    builder
      .addCase(updateCompany.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.isLoading = false;
          const index = state.companies.findIndex(
            c => c.id === action.payload.id
          );
          if (index !== -1) {
            state.companies[index] = action.payload;
          }
          if (state.currentCompany?.id === action.payload.id) {
            state.currentCompany = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to update company';
      });

    // Delete company
    builder
      .addCase(deleteCompany.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.companies = state.companies.filter(
            c => c.id !== action.payload
          );
          if (state.currentCompany?.id === action.payload) {
            state.currentCompany = null;
          }
          state.error = null;
        }
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to delete company';
      });
  },
});

/**
 * Export actions (for direct reducer actions like clearError)
 */
export const { clearError, clearCurrentCompany, resetCompanyState } =
  companySlice.actions;

/**
 * Selectors - For easier state access
 */
export const selectCompanyState = (state: RootState) => state.company;
export const selectCompanies = (state: RootState) => state.company.companies;
export const selectCurrentCompany = (state: RootState) =>
  state.company.currentCompany;
export const selectCompanyDetail = (state: RootState) =>
  state.company.companyDetail;
export const selectCompanyLoading = (state: RootState) =>
  state.company.isLoading;
export const selectCompanyError = (state: RootState) => state.company.error;

/**
 * Export reducer
 */
export default companySlice.reducer;
