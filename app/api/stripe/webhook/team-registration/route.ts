import { supabaseAdmin } from "@/lib/supabase/client-safe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout completion:', session.id);

  const teamId = session.metadata?.teamId;
  const paymentId = session.metadata?.paymentId;
  const contactEmail = session.metadata?.contactEmail;

  if (!teamId) {
    console.error('No team ID in session metadata');
    return;
  }

  try {
    // Update team payment status
    const { error: teamError } = await supabaseAdmin
      .from('teams')
      .update({ 
        payment_status: 'paid',
        status: 'approved'
      })
      .eq('id', teamId);

    if (teamError) {
      console.error('Error updating team:', teamError);
    }

    // Update payment record
    if (paymentId) {
      const { error: paymentError } = await supabaseAdmin
        .from('team_payments')
        .update({
          status: 'completed',
          stripe_payment_intent_id: session.payment_intent as string,
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (paymentError) {
        console.error('Error updating payment:', paymentError);
      }
    }

    // Create team member relationship for the primary contact
    if (contactEmail) {
      try {
        // Get or create user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: contactEmail,
          email_confirm: true
        });

        if (authError && !authError.message.includes('already registered')) {
          console.error('Error creating user:', authError);
        } else {
          const userId = authData?.user?.id;
          
          if (userId) {
            // Check if team member relationship already exists
            const { data: existingMember } = await supabaseAdmin
              .from('team_members')
              .select('id')
              .eq('team_id', teamId)
              .eq('user_id', userId)
              .single();

            if (!existingMember) {
              // Create team member relationship
              const { error: memberError } = await supabaseAdmin
                .from('team_members')
                .insert({
                  team_id: teamId,
                  user_id: userId,
                  role: 'admin',
                  status: 'active',
                  can_manage_roster: true,
                  can_view_payments: true,
                  can_edit_team_info: true
                });

              if (memberError) {
                console.error('Error creating team member:', memberError);
              } else {
                console.log('Team member relationship created for:', contactEmail);
              }
            }
          }
        }
      } catch (authError) {
        // User might already exist, try to find them
        console.log('User might already exist, attempting to find:', contactEmail);
        
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === contactEmail);
        
        if (existingUser) {
          // Check if team member relationship already exists
          const { data: existingMember } = await supabaseAdmin
            .from('team_members')
            .select('id')
            .eq('team_id', teamId)
            .eq('user_id', existingUser.id)
            .single();

          if (!existingMember) {
            // Create team member relationship
            const { error: memberError } = await supabaseAdmin
              .from('team_members')
              .insert({
                team_id: teamId,
                user_id: existingUser.id,
                role: 'admin',
                status: 'active',
                can_manage_roster: true,
                can_view_payments: true,
                can_edit_team_info: true
              });

            if (memberError) {
              console.error('Error creating team member:', memberError);
            } else {
              console.log('Team member relationship created for existing user:', contactEmail);
            }
          }
        }
      }
    }

    console.log('Registration completion processed successfully');
  } catch (error) {
    console.error('Error processing checkout completion:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // Update payment record if we have the payment ID
  const { error } = await supabaseAdmin
    .from('team_payments')
    .update({
      status: 'completed',
      stripe_payment_intent_id: paymentIntent.id,
      paid_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment on success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  // Update payment record
  const { error } = await supabaseAdmin
    .from('team_payments')
    .update({
      status: 'failed'
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment on failure:', error);
  }
}