import { NextResponse } from 'next/server';
import { getSession } from '../../../../utils/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  const session = await getSession(); // Add await here
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const options = {
      amount: 299 * 100, // ₹299 in paise
      currency: 'INR',
      receipt: `receipt_${session.userId}_${Date.now()}`,
      payment_capture: 1,
    };
    
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create order', error: (error as Error).message },
      { status: 500 }
    );
  }
}