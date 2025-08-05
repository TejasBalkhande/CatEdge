// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
  
  response.cookies.set('session', '', {
    httpOnly: true,
    
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}