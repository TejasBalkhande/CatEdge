// app/api/progress/route.ts
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';
import { getSession } from '../../../../utils/auth';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { section, topic, isCorrect } = await request.json();
    
    // Find user and update progress
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find existing progress for this topic
    const topicProgress = user.progress.find(
      (p: any) => p.section === section && p.topic === topic
    );

    if (topicProgress) {
      // Update existing progress
      topicProgress.attempted += 1;
      if (isCorrect) topicProgress.correct += 1;
    } else {
      // Create new progress entry
      user.progress.push({
        section,
        topic,
        attempted: 1,
        correct: isCorrect ? 1 : 0
      });
    }

    await user.save();
    
    return NextResponse.json({ message: 'Progress updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}