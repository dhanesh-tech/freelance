import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, generateTokens, setAuthCookies } from '@/utils/auth';

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);
    
    // Create response
    const response = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    // Set new cookies
    setAuthCookies(response, tokens);

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Error refreshing token' },
      { status: 500 }
    );
  }
} 