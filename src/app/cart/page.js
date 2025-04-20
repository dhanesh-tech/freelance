'use client'
import React from 'react'

import Image from 'next/image'
import { useCart } from './cartContext'
function CartPage() {
  const { 
        cart: cartItems, 
        totalItems, 
        totalPrice, 
        addToCart, 
        increaseQuantity, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart 
    } = useCart()

  // Dummy products data
  const dummyProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Smartphone",
      price: 699.99,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Laptop",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      name: "Smartwatch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cart Summary</h2>
          <div className="text-right">
            <p className="text-gray-600">Total Items: {totalItems}</p>
            <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
          </div>
        </div>
        
        {cartItems.length > 0 ? (
          <button 
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        ) : null}
      </div>
      
      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-4">
                <div className="w-20 h-20 relative mr-4">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Available Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dummyProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="relative h-48">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CartPage