import { NextRequest, NextResponse } from 'next/server';
import { adminStorage, adminDb } from '@/lib/firebase-admin';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const sessionId = formData.get('sessionId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing file or userId' },
        { status: 400 }
      );
    }

    const fileId = uuid();
    const fileName = `${Date.now()}-${file.name}`;
    const bucket = adminStorage.bucket();
    const filePath = `uploads/${userId}/${sessionId || 'general'}/${fileName}`;

    const fileBuffer = await file.arrayBuffer();
    await bucket.file(filePath).save(Buffer.from(fileBuffer), {
      contentType: file.type,
    });

    const downloadUrl = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Save file metadata to Firestore
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('files')
      .doc(fileId)
      .set({
        name: file.name,
        size: file.size,
        type: file.type,
        storageRef: filePath,
        downloadUrl: downloadUrl[0],
        uploadedAt: new Date(),
        sessionId: sessionId || null,
      });

    return NextResponse.json(
      {
        fileId,
        name: file.name,
        url: downloadUrl[0],
        storageRef: filePath,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
