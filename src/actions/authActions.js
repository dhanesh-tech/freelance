import api from '../services/api';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT,
  CHECK_AUTH_REQUEST,
  CHECK_AUTH_SUCCESS,
  CHECK_AUTH_FAILURE
} from './types';

// Check authentication status
export const checkAuth = () => async (dispatch) => {
  dispatch({ type: CHECK_AUTH_REQUEST });
  
  try {
    const response = await api.get('/auth/me');
    const { user } = response.data;
    
    dispatch({
      type: CHECK_AUTH_SUCCESS,
      payload: { user }
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: CHECK_AUTH_FAILURE,
      payload: error.response?.data?.message || 'Authentication check failed'
    });
    throw error;
  }
};

// Login action
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    
    const response = await api.post('/auth/login', credentials);
    const { user } = response.data;
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user }
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || 'Login failed'
    });
    throw error;
  }
};

// Logout action
export const logout = () => async (dispatch) => {
  try {
    await api.post('/auth/logout');
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error('Logout failed:', error);
    // Still dispatch logout to clear state
    dispatch({ type: LOGOUT });
  }
};

// Sign Up action
export const signUp = (formData) => async (dispatch) => {
  dispatch({ type: SIGN_UP_REQUEST });
  
  try {
    const response = await api.post('/auth/signup', formData);
    const { user } = response.data;
    
    dispatch({
      type: SIGN_UP_SUCCESS,
      payload: { user }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Something went wrong';
    
    dispatch({
      type: SIGN_UP_FAILURE,
      payload: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

// Sign In action
export const signIn = (formData) => async (dispatch) => {
  dispatch({ type: SIGN_IN_REQUEST });
  
  try {
    const response = await api.post('/auth/signin', formData);
    const { user } = response.data;
    
    dispatch({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Something went wrong';
    
    dispatch({
      type: SIGN_IN_FAILURE,
      payload: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

// Sign Out action
export const signOut = () => async (dispatch) => {
  try {
    await api.post('/auth/signout');
    dispatch({ type: SIGN_OUT });
  } catch (error) {
    console.error('Sign out failed:', error);
    // Still dispatch sign out to clear state
    dispatch({ type: SIGN_OUT });
  }
}; 