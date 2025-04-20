

import { FETCH_CART_FAILURE, FETCH_CART_REQUEST, FETCH_CART_SUCCESS } from './types';
import api from '@/services/api';

/**
 * Cart Actions
 * 
 * This file contains server actions for interacting with the cart API.
 * These actions can be imported and used in client components.
 */

/**
 * Fetch the current cart from the server
 * @returns {Promise<Object>} The cart data
 */
export const fetchCart = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CART_REQUEST });
    const response = await api.get('/cart/updateCartItems');
    dispatch({ type: FETCH_CART_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: FETCH_CART_FAILURE, payload: error.message });
    console.error('Error fetching cart:', error);
    return { success: false, error: error.message, cartItems: [] };
  }
}

/**
 * Add an item to the cart
 * @param {Object} product - The product to add
 * @param {number} quantity - The quantity to add (default: 1)
 * @returns {Promise<Object>} The updated cart data
 */
export async function addToCart(product, quantity = 1) {
  try {
    const response = await api.post('/cart/updateCartItems', {
      action: 'add',
      product,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove an item from the cart
 * @param {number|string} productId - The ID of the product to remove
 * @returns {Promise<Object>} The updated cart data
 */
export async function removeFromCart(productId) {
  try {
    const response = await api.post('/cart/updateCartItems', {
      action: 'remove',
      productId,
    });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update the quantity of an item in the cart
 * @param {number|string} productId - The ID of the product to update
 * @param {number} quantity - The new quantity
 * @returns {Promise<Object>} The updated cart data
 */
export async function updateCartItemQuantity(productId, quantity) {
  try {
    const response = await api.post('/cart/updateCartItems', {
      action: 'update',
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear the entire cart
 * @returns {Promise<Object>} The updated cart data
 */
export async function clearCart() {
  try {
      const response = await api.post('/cart/updateCartItems', {
      action: 'clear',
    });
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Store the entire cart on the server
 * @param {Array} cart - The cart items to store
 * @returns {Promise<Object>} The response from the server
 */
export async function storeCart(cart) {
  try {
      const response = await api.put('/cart/updateCartItems', { cart });
    return response.data;
  } catch (error) {
    console.error('Error storing cart:', error);
    return { success: false, error: error.message };
  }
}



