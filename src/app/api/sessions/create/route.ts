import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId, title, description } = await req.json();

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sessionId = uuid();

    await adminDb
      .collection('users')
      .doc(userId)
      .collection('sessions')
      .doc(sessionId)
      .set({
        title,
        description: description || '',
        files: [],
        weaknesses: [],
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
      });

    return NextResponse.json(
      {
        sessionId,
        message: 'Session created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Session creation failed' },
      { status: 500 }
    );
  }
}
