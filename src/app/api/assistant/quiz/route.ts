import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { adminDb } from '@/lib/firebase-admin';
import { v4 as uuid } from 'uuid';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { topic, questionCount = 5, sessionId, userId } = await req.json();

    if (!topic || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Generate exactly ${questionCount} multiple choice quiz questions about "${topic}".

Format your response as a JSON array with this structure:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct..."
  }
]

Ensure questions vary in difficulty. Make options realistic and plausible.`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    let quizText = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        quizText = block.text;
      }
    }

    // Parse JSON response
    const jsonMatch = quizText.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse quiz response');
    }

    const quizData = JSON.parse(jsonMatch[0]);
    const quizId = uuid();

    // Save quiz to Firestore
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('quizzes')
      .doc(quizId)
      .set({
        topic,
        questions: quizData,
        sessionId: sessionId || null,
        createdAt: new Date(),
        completed: false,
      });

    return NextResponse.json(
      {
        quizId,
        questions: quizData,
        count: quizData.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Quiz generation failed' },
      { status: 500 }
    );
  }
}
