import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { env } from '@/env.mjs';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: '2024-04-10',
});

export function serverErrorResponse(error?: unknown, headers: Record<string, string> = {}) {
  return NextResponse.json(
    {
      code: 'internal_server_error',
      message: 'An internal server error occurred',
      error,
    },
    { headers, status: 500 }
  );
}
