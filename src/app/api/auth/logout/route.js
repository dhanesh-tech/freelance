import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/utils/auth';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error logging out' },
      { status: 500 }
    );
  }
} 