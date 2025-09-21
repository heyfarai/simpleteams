import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Initialize Supabase client with service role key for admin operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);