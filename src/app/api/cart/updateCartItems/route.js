import { NextResponse } from 'next/server';

// In a real application, you would use a database
// This is a simple in-memory store for demonstration
let cartItems = [];

// GET method to retrieve cart items
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      cartItems 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

// POST method to update cart items
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, product, productId, quantity } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'add':
        if (!product) {
          return NextResponse.json(
            { success: false, error: 'Product is required for add action' },
            { status: 400 }
          );
        }
        
        // Check if product already exists in cart
        const existingItemIndex = cartItems.findIndex(
          (item) => item.id === product.id
        );

        if (existingItemIndex >= 0) {
          // Update quantity if product exists
          cartItems[existingItemIndex].quantity += quantity || 1;
        } else {
          // Add new product to cart
          cartItems.push({ ...product, quantity: quantity || 1 });
        }
        break;

      case 'remove':
        if (!productId) {
          return NextResponse.json(
            { success: false, error: 'Product ID is required for remove action' },
            { status: 400 }
          );
        }
        
        cartItems = cartItems.filter((item) => item.id !== productId);
        break;

      case 'update':
        if (!productId || quantity === undefined) {
          return NextResponse.json(
            { success: false, error: 'Product ID and quantity are required for update action' },
            { status: 400 }
          );
        }
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          cartItems = cartItems.filter((item) => item.id !== productId);
        } else {
          // Update quantity
          const itemIndex = cartItems.findIndex((item) => item.id === productId);
          if (itemIndex >= 0) {
            cartItems[itemIndex].quantity = quantity;
          }
        }
        break;

      case 'clear':
        cartItems = [];
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Calculate totals
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return NextResponse.json({ 
      success: true, 
      cartItems,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}


// store whole cart on the server side
 export async function PUT(request){
    const body = await request.json()
    const {cart} = body
    cartItems = cart
    return NextResponse.json({success: true, cartItems})
 }