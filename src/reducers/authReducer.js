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
} from '../actions/types';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  authChecked: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGN_IN_REQUEST:
    case SIGN_UP_REQUEST:
    case CHECK_AUTH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case LOGIN_SUCCESS:
    case SIGN_IN_SUCCESS:
    case SIGN_UP_SUCCESS:
    case CHECK_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
        authChecked: true
      };
      
    case LOGIN_FAILURE:
    case SIGN_IN_FAILURE:
    case SIGN_UP_FAILURE:
    case CHECK_AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        authChecked: true
      };
      
    case LOGOUT:
    case SIGN_OUT:
      return {
        ...initialState,
        authChecked: true
      };
      
    default:
      return state;
  }
};

export default authReducer; 