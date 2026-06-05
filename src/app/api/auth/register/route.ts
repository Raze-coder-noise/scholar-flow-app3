import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    // Validate input
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    });

    // Create user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
      streak: 0,
      totalStudyTime: 0,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        uid: userRecord.uid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
}
