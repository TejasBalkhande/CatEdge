import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';
import { generateToken, hashPassword } from '../../../../utils/auth';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { fullName, email, password } = await request.json();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const user = new User({ fullName, email, password: hashedPassword, role: 'free' });
    await user.save();
    
    // Generate JWT
    const token = generateToken(user._id.toString(), user.role);
    
    // Set cookie
    const response = NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
    
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
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