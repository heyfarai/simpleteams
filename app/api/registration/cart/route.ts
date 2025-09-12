import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  'https://qrvmoeoifjszbujnllbu.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Test connection
  try {
    const { data: test, error: testError } = await supabase
      .from('registration_carts')
      .select('count')
      .limit(1);

    console.log('Connection test:', { data: test, error: testError });
  } catch (e) {
    console.error('Connection test error:', e);
  }
  const { email, formData, step } = await request.json();

  try {
    console.log('Attempting to save cart:', { email, step });
    
    const { data, error } = await supabase
      .from('registration_carts')
      .upsert(
        { email, form_data: formData, step },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Cart saved successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Fetching cart for email:', email);

    const { data, error } = await supabase
      .from('registration_carts')
      .select()
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Cart fetched successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
