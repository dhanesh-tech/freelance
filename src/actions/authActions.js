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
  SIGN_OUT
} from './types';

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token, user }
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

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
};

// Sign Up Action
export const signUp = (formData) => async (dispatch) => {
  dispatch({ type: SIGN_UP_REQUEST });
  
  try {
    const response = await api.post('/auth/signup', formData);
    
    dispatch({
      type: SIGN_UP_SUCCESS,
      payload: response.data
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

// Sign In Action
export const signIn = (formData) => async (dispatch) => {
  dispatch({ type: SIGN_IN_REQUEST });
  
  try {
    const response = await api.post('/auth/signin', formData);
    
    dispatch({
      type: SIGN_IN_SUCCESS,
      payload: response.data
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

// Sign Out Action
export const signOut = () => ({
  type: SIGN_OUT
}); 