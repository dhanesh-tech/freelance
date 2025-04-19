import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateTokens, setAuthCookies } from '@/utils/auth';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokens = generateTokens(user._id);
    
    // Create response
    const response = NextResponse.json(
      { message: 'Logged in successfully' },
      { status: 200 }
    );

    // Set cookies
    setAuthCookies(response, tokens);

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Error signing in' },
      { status: 500 }
    );
  }
} 