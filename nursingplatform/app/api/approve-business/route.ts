import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { businessName, email } = await request.json();

  // Yahan par hum email bhejte hain. 
  // Abhi hum console mein print karenge kyunki real API key chahiye hoti hai.
  console.log(`Sending Approval Email to: ${email} for Business: ${businessName}`);

  // In a real app, you'd use a library here:
  // await resend.emails.send({ from: 'admin@nurseflex.com', to: email, ... });

  return NextResponse.json({ success: true, message: "Email Sent Successfully!" });
}