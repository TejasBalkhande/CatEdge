// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '../../../../utils/auth';
import User from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';

// REMOVE THESE LINES:
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await dbConnect();
    const user = await User.findById(session.userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}