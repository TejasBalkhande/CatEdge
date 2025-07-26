import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '../../../../utils/auth';
import User from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';

export async function POST(request: Request) {
  const session = await getSession(); // Add await here
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json();
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
    }
    
    // Update user role to premium
    await dbConnect();
    await User.findByIdAndUpdate(session.userId, { role: 'premium' });
    
    return NextResponse.json({ message: 'Payment verified and user upgraded' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Payment verification failed', error: (error as Error).message },
      { status: 500 }
    );
  }
}