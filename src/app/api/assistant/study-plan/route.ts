import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { adminDb } from '@/lib/firebase-admin';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { weaknesses, studyTime = 7, userId, sessionId } = await req.json();

    if (!weaknesses || weaknesses.length === 0 || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const weaknessesText = weaknesses.join(', ');
    const prompt = `Create a personalized ${studyTime}-day study plan to address these weak areas: ${weaknessesText}.

Provide:
1. Daily schedule with time blocks
2. Specific topics to study each day
3. Study techniques and resources
4. Practice exercises
5. Milestones and checkpoints

Format the response as a clear, structured plan that can be followed daily.
Be realistic about time commitment and build confidence progressively.`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    let planText = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        planText = block.text;
      }
    }

    // Save study plan to Firestore
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('study_plans')
      .add({
        weaknesses,
        studyPlan: planText,
        duration: studyTime,
        sessionId: sessionId || null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      });

    return NextResponse.json(
      {
        plan: planText,
        duration: studyTime,
        weaknesses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Study plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Study plan generation failed' },
      { status: 500 }
    );
  }
}
