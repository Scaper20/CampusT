import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://hiccjafmdxghjhbkzksg.supabase.co/health', {
      cache: 'no-store'
    });
    return NextResponse.json({ status: res.status, text: await res.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
