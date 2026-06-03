import { createSlice } from '@reduxjs/toolkit';

const loadAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return { token, user: JSON.parse(user), isAuthenticated: true };
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null, isAuthenticated: false };
};

const initialState = {
  ...loadAuth(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsHost = (state) => state.auth.user?.role === 'host';
