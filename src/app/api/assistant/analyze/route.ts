import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { adminDb } from '@/lib/firebase-admin';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query, sessionId, userId, fileNames = [] } = await req.json();

    if (!query || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch file metadata from Firestore
    const filesSnapshot = await adminDb
      .collection('users')
      .doc(userId)
      .collection('files')
      .where('sessionId', '==', sessionId)
      .limit(10)
      .get();

    const filesContext = filesSnapshot.docs
      .map((doc) => `- ${doc.data().name}`)
      .join('\n');

    // Create context for Claude
    const systemPrompt = `You are an expert academic study assistant helping students learn effectively.

Student's uploaded materials:
${filesContext || 'No files uploaded'}

Provide:
1. Clear, structured responses
2. Actionable study strategies
3. Key concepts and takeaways
4. Questions to test understanding

Be encouraging and adaptive to learning pace.`;

    // Call Claude API with streaming
    let fullResponse = '';

    const stream = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    });

    for (const block of stream.content) {
      if (block.type === 'text') {
        fullResponse += block.text;
      }
    }

    // Save conversation to Firestore
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('conversations')
      .add({
        query,
        response: fullResponse,
        sessionId: sessionId || null,
        createdAt: new Date(),
        type: 'analysis',
      });

    return NextResponse.json(
      {
        response: fullResponse,
        conversationId: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Assistant error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Assistant request failed' },
      { status: 500 }
    );
  }
}
