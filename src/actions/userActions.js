import api from '../services/api';
import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER,
} from './types';

export const fetchUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_REQUEST });
    
    const response = await api.get(`/users/${userId}`);
    
    dispatch({
      type: FETCH_USER_SUCCESS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch user'
    });
    throw error;
  }
};

export const updateUser = (userId, userData) => async (dispatch) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    
    dispatch({
      type: UPDATE_USER,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
}; 