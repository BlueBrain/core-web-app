import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import get from 'lodash/get';
import { getServerSession } from 'next-auth/next';
import z from 'zod';

import { stripe, serverErrorResponse } from '../../utils';
import { authOptions } from '@/auth';
import { AddNewPaymentMethodToVirtualLab } from '@/services/virtual-lab/billing';

const paymentMethodPayload = z.object({
  customerId: z.string(),
  virtualLabId: z.string(),
  name: z.string(),
  email: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const setupIntent = get(body, 'setupIntent', null);

  const { data, error, success } = await paymentMethodPayload.safeParseAsync({
    customerId: get(body, 'customerId', null),
    virtualLabId: get(body, 'virtualLabId', null),
    name: get(body, 'name', null),
    email: get(body, 'email', null),
  });

  if (!success) {
    return new Response(
      JSON.stringify({
        message: 'Payment method payload parse failed',
        error,
      }),
      {
        status: 400,
      }
    );
  }

  if (!setupIntent) {
    return new Response(
      JSON.stringify({
        message: 'No setupIntent was provided',
      }),
      {
        status: 400,
      }
    );
  }

  try {
    if (session) {
      const { customerId, virtualLabId, name, email } = data;
      const setupIntentExpanded = await stripe.setupIntents.retrieve(setupIntent, {
        expand: ['payment_method'],
      });
      const paymentMethod = setupIntentExpanded.payment_method as Stripe.PaymentMethod;

      let expireAt = '';
      if (paymentMethod.card?.exp_month && paymentMethod.card?.exp_year) {
        expireAt = `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`;
      }

      const vlabPaymentMethod = await AddNewPaymentMethodToVirtualLab(
        virtualLabId,
        session.accessToken,
        {
          customerId,
          name,
          email,
          expireAt,
          paymentMethodId: paymentMethod.id,
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
        }
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment method added to virtual lab successfully',
          paymentMethod: vlabPaymentMethod,
        })
      );
    }

    return new Response(
      JSON.stringify({
        error: 'No session was found',
      }),
      {
        status: 400,
      }
    );
  } catch (err) {
    return serverErrorResponse(err);
  }
}
