// app/api/progress/route.ts
import { NextResponse } from 'next/server';
import User, { IUser, IProgress } from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';
import { getSession } from '../../../../utils/auth';

interface ProgressPayload {
  section: string;
  topic: string;
  isCorrect: boolean;
}

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload: ProgressPayload = await request.json();
    const { section, topic, isCorrect } = payload;
    
    // Find user and update progress
    const user: IUser | null = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find existing progress for this topic
    const topicProgress: IProgress | undefined = user.progress.find(
      p => p.section === section && p.topic === topic
    );

    if (topicProgress) {
      // Update existing progress
      topicProgress.attempted += 1;
      if (isCorrect) topicProgress.correct += 1;
    } else {
      // Create new progress entry
      const newProgress: IProgress = {
        section,
        topic,
        attempted: 1,
        correct: isCorrect ? 1 : 0
      };
      user.progress.push(newProgress);
    }

    await user.save();
    
    return NextResponse.json({ message: 'Progress updated' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Server error', error: errorMessage },
      { status: 500 }
    );
  }
}