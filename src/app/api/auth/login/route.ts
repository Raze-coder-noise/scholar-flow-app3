import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token required' },
        { status: 400 }
      );
    }

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    return NextResponse.json(
      {
        message: 'Login successful',
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid token or login failed' },
      { status: 401 }
    );
  }
}
