import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
} from '../actions/types';

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  cartFetched: false
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request actions - set loading state
    case FETCH_CART_REQUEST:

      return {
        ...state
      };
      
    // Success actions - update cart data
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        cartItems: action.payload.cartItems
    }
    // Failure actions - set error state
    case FETCH_CART_FAILURE:

      return {
        ...state
      };
      
    default:
      return state;
  }
};

export default cartReducer;
