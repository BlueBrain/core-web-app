import { NextRequest } from 'next/server';
import get from 'lodash/get';
import { getServerSession } from 'next-auth/next';

import { z } from 'zod';
import { stripe, serverErrorResponse } from '../utils';
import { authOptions } from '@/auth';

const customerPayload = z.object({
  customerId: z.string(),
  name: z.string(),
  email: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const { data, error, success } = await customerPayload.safeParseAsync({
    customerId: get(body, 'customerId', null),
    name: get(body, 'name', null),
    email: get(body, 'email', null),
  });

  if (!success) {
    return new Response(
      JSON.stringify({
        message: 'Customer payload parse failed',
        error,
      }),
      {
        status: 400,
      }
    );
  }

  try {
    if (session) {
      const { customerId, name, email } = data;
      const customer = await stripe.customers.update(customerId, {
        name,
        email,
      });

      return new Response(
        JSON.stringify({
          id: customer.id,
          name: customer.name ?? '',
          email: customer.email ?? '',
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
  } catch (err) {
    return serverErrorResponse(err);
  }
}
