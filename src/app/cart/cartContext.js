'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart as clearCartAction,
  storeCart
} from '@/actions/cart.actions';

// Create the cart context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper function to compare cart items
const areCartsEqual = (cart1, cart2) => {
  if (!cart1 || !cart2) return false;
  if (cart1.length !== cart2.length) return false;
  
  // Sort both arrays by id to ensure consistent comparison
  const sortedCart1 = [...cart1].sort((a, b) => a.id - b.id);
  const sortedCart2 = [...cart2].sort((a, b) => a.id - b.id);
  
  return sortedCart1.every((item, index) => {
    const otherItem = sortedCart2[index];
    return item.id === otherItem.id && item.quantity === otherItem.quantity;
  });
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector(state => state.cart);
  
  // Initialize cart state from localStorage if available
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  
  // Add state for total items and price
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSyncing, setIsSyncing] = useState(true);

  // Calculate totals whenever cart changes
  useEffect(() => {
    calculateTotals(cart);
  }, [cart]);

  // Fetch cart from server on initial load
  useEffect(() => {

    syncCartWithServer();
  }, []);

  // Check if cartItems and cart are the same, if not, sync with server
  useEffect(() => {
    if (cartItems && !isSyncing) {
      // Check if the carts are different
      if (!areCartsEqual(cart, cartItems)) {

        syncLocalCartWithServer();
      } else{
       setCart(cartItems);
      }
    }
  }, [cartItems]);

  // Calculate total items and price
  const calculateTotals = (items) => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const price = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart
  const handleAddToCart = async (product, quantity = 1) => {
    try {

      const result = await addToCart(product, quantity);
      // if (result.success) {
        // Update local cart state

        const existingItemIndex = cart.findIndex(
          (item) => item.id === product.id
        );

         if (existingItemIndex >= 0) {
          // Update quantity if product exists
          const updatedCart = [...cart];

          updatedCart[existingItemIndex].quantity += 1;
          setCart(updatedCart);
        } else {
          // Add new product to cart
          setCart([...cart, { ...product, quantity }]);
        }
       
      // }

    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message };
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      const result = await removeFromCart(productId);

        // Update local cart state
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

      return result;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: error.message };
    }
  };

  // Update item quantity in cart
  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return handleRemoveFromCart(productId);
    }

    try {
      const result = await updateCartItemQuantity(productId, quantity);

        // Update local cart state
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        );

      return result;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error: error.message };
    }
  };

  // Increase item quantity
  const handleIncreaseQuantity = async (itemId) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      return handleUpdateQuantity(itemId, item.quantity + 1);
    }
    return { success: false, error: 'Item not found in cart' };
  };

  // Decrease item quantity
  const handleDecreaseQuantity = async (itemId) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        return handleUpdateQuantity(itemId, item.quantity - 1);
      } else {
        return handleRemoveFromCart(itemId);
      }
    }
    return { success: false, error: 'Item not found in cart' };
  };

  // Clear the entire cart
  const handleClearCart = async () => {
    try {
      const result = await clearCartAction();
      if (result.success) {
        // Update local cart state
        setCart([]);
      }
      return result;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: error.message };
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Calculate total items in cart
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  // Sync cart with server (fetch from server)
  const syncCartWithServer = async () => {
    try {
      setIsSyncing(true);
      await dispatch(fetchCart());
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync local cart with server (send to server)
  const syncLocalCartWithServer = async () => {
    try {
      setIsSyncing(true);
      const result = await storeCart(cart);
      if (result.success) {

      } 
    } catch (error) {
      console.error('Error syncing local cart with server:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Context value
  const value = {
    cart,
    totalItems,
    totalPrice,
    loading,
    error,
    isSyncing,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    increaseQuantity: handleIncreaseQuantity,
    decreaseQuantity: handleDecreaseQuantity,
    clearCart: handleClearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    syncCartWithServer,
    syncLocalCartWithServer
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

