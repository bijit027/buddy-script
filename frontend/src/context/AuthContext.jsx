import { createContext, useContext, useEffect, useReducer } from 'react';
import { authService } from '../services/api';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On app start: verify stored token against /me
  useEffect(() => {
    const token = localStorage.getItem('bs_token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    authService
      .getMe()
      .then((res) => {
        dispatch({
          type: 'LOGIN',
          payload: { user: res.data, token },
        });
      })
      .catch(() => {
        // Token invalid or expired — clear storage
        localStorage.removeItem('bs_token');
        localStorage.removeItem('bs_user');
        dispatch({ type: 'LOGOUT' });
      });
  }, []);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token, user } = res.data;

    localStorage.setItem('bs_token', token);
    localStorage.setItem('bs_user', JSON.stringify(user));

    dispatch({ type: 'LOGIN', payload: { token, user } });
    return user;
  };

  const register = async (firstName, lastName, email, password, passwordConfirmation) => {
    const res = await authService.register(firstName, lastName, email, password, passwordConfirmation);
    const { token, user } = res.data;

    localStorage.setItem('bs_token', token);
    localStorage.setItem('bs_user', JSON.stringify(user));

    dispatch({ type: 'LOGIN', payload: { token, user } });
    return user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // Even if API call fails, clear local state
    } finally {
      localStorage.removeItem('bs_token');
      localStorage.removeItem('bs_user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData) => {
    const updated = { ...state.user, ...userData };
    localStorage.setItem('bs_user', JSON.stringify(updated));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
