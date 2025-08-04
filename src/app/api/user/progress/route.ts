// app/api/user/progress/route.ts
import { NextResponse } from 'next/server';
import User from '../../../../../models/User';
import dbConnect from '../../../../../lib/dbConnect';
import { getSession } from '../../../../../utils/auth';

// Add this configuration to prevent static export attempts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await dbConnect();
  
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.userId).select('progress');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.progress);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}