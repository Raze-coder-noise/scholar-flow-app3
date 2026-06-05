import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionDoc = await adminDb
      .collection('users')
      .doc(userId)
      .collection('sessions')
      .doc(sessionId)
      .get();

    if (!sessionDoc.exists) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        sessionId,
        ...sessionDoc.data(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const userId = req.headers.get('x-user-id');
    const updates = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await adminDb
      .collection('users')
      .doc(userId)
      .collection('sessions')
      .doc(sessionId)
      .update({
        ...updates,
        updatedAt: new Date(),
      });

    return NextResponse.json(
      { message: 'Session updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update session' },
      { status: 500 }
    );
  }
}
