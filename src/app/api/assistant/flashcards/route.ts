import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { adminDb } from '@/lib/firebase-admin';
import { v4 as uuid } from 'uuid';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { topic, count = 5, sessionId, userId } = await req.json();

    if (!topic || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Generate exactly ${count} flashcards for studying "${topic}".

Format your response as a JSON array with this structure:
[
  {
    "question": "What is..?",
    "answer": "...",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Make questions clear and answers comprehensive but concise.`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    let flashcardsText = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        flashcardsText = block.text;
      }
    }

    // Parse JSON response
    const jsonMatch = flashcardsText.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse flashcard response');
    }

    const flashcardsData = JSON.parse(jsonMatch[0]);
    const flashcardIds: string[] = [];

    // Save flashcards to Firestore
    const batch = adminDb.batch();
    flashcardsData.forEach((card: any) => {
      const cardId = uuid();
      flashcardIds.push(cardId);
      const ref = adminDb
        .collection('users')
        .doc(userId)
        .collection('flashcards')
        .doc(cardId);
      batch.set(ref, {
        ...card,
        sessionId: sessionId || null,
        createdAt: new Date(),
      });
    });

    await batch.commit();

    return NextResponse.json(
      {
        flashcards: flashcardsData,
        count: flashcardsData.length,
        ids: flashcardIds,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Flashcard generation failed' },
      { status: 500 }
    );
  }
}
