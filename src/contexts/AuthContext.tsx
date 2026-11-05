import React, { useReducer, useEffect, ReactNode } from 'react';
import {
  AuthContextType,
  AuthState,
  User,
  LoginCredentials,
  UserRole,
} from '@/types';
import { authService } from '@/services/authService';
import { AuthContext } from './authContextDefinition';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_UPDATE_USER'; payload: Partial<User> }
  | { type: 'AUTH_CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const syncCompanyApproval = (user: User): User => {
  if (user.role !== UserRole.ADMIN) return user;

  if (typeof user.isCompanyActive === 'boolean') {
    return { ...user, isRegisterComplete: user.isCompanyActive };
  }

  return { ...user, isRegisterComplete: false };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const user = syncCompanyApproval(await authService.getCurrentUser());
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: '' });
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.login(credentials);

      const user = syncCompanyApproval(response.user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', response?.token);
      if (credentials.rememberMe) {
        localStorage.setItem('refreshToken', response.refreshToken);
        sessionStorage.removeItem('refreshToken');
      } else {
        sessionStorage.setItem('refreshToken', response.refreshToken);
        localStorage.removeItem('refreshToken');
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: response.token },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue =
        localStorage.getItem('refreshToken') ||
        sessionStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      localStorage.setItem('authToken', response.token);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (state.user) {
      localStorage.setItem(
        'user',
        JSON.stringify({ ...state.user, ...userData })
      );
    }
    dispatch({ type: 'AUTH_UPDATE_USER', payload: userData });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
