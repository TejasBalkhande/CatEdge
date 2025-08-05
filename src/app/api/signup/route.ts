import { NextResponse } from 'next/server';
import User, { IUser } from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';
import { generateToken, hashPassword } from '../../../../utils/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { fullName, email, password } = await request.json();
    
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user: IUser = new User({ 
      fullName, 
      email, 
      password: hashedPassword, 
      role: 'free' 
    });
    
    await user.save();
    
    const token = generateToken(user._id.toString(), user.role);
    
    const response = NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
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