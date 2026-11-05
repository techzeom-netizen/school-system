import { combineReducers, AnyAction } from '@reduxjs/toolkit';
import companyReducer from '../slices/company.slice';
import authReducer from '../slices/auth.slice';
import superAdminCompanyReducer from '../slices/superadminCompany.slice';

/**
 * Root Reducer - Combines all slice reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  superAdminCompany: superAdminCompanyReducer,
});

// Create RootState type
export type RootState = ReturnType<typeof rootReducer>;

/**
 * App Reducer - Handles logout by resetting state
 */
export const appReducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: AnyAction
) => {
  // Reset state on logout
  if (action.type === 'AUTH_LOGOUT') {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
