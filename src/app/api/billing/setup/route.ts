import { NextRequest } from 'next/server';
import get from 'lodash/get';
import { getServerSession } from 'next-auth/next';

import { stripe, serverErrorResponse } from '../utils';
import { authOptions } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  try {
    if (session) {
      const customer = await stripe.customers.create({
        metadata: {
          virtual_lab_id: get(body, 'virtualLabId', null),
        },
      });
      const setupIntent = await stripe.setupIntents.create({ customer: customer.id });

      return new Response(
        JSON.stringify({
          intentId: setupIntent.id,
          clientSecret: setupIntent.client_secret,
          customerId: customer.id,
        })
      );
    }

    return new Response(
      JSON.stringify({
        message: 'No session was found',
      }),
      {
        status: 400,
      }
    );
  } catch (error) {
    return serverErrorResponse(error);
  }
}
