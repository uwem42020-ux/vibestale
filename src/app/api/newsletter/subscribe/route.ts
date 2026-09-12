import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalized = email.trim().toLowerCase();

    if (!emailRegex.test(normalized)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert into newsletter_subscribers table
    // Assumes a table with: id (uuid), email (unique), created_at, status
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: normalized, status: 'active' });

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        );
      }
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json(
        { error: 'Unable to subscribe right now. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Newsletter subscribe exception:', err);
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}