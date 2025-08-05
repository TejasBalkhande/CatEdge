import { NextResponse } from 'next/server';
import User, { IUser } from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';
import { comparePasswords, generateToken } from '../../../../utils/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { email, password } = await request.json();
    
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = generateToken(user._id.toString(), user.role);
    
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
    
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}