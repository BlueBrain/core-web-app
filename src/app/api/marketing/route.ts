import { captureException } from '@sentry/nextjs';
import { env } from '@/env.mjs';

type RequestBody = {
  firstName: string;
  lastName: string;
  email: string;
};

const API_KEY = env.MAILCHIMP_API_KEY;
const AUDIENCE_ID = env.MAILCHIMP_AUDIENCE_ID;
const DATACENTER = API_KEY && API_KEY.split('-')[1];

export const POST = async (req: Request) => {
  const { firstName, lastName, email } = (await req.json()) as RequestBody;

  if (!email || !firstName || !lastName) {
    return new Response('Missing required fields', {
      status: 400,
      statusText: 'Missing required fields',
    });
  }

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
    update_existing: true,
  };

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}`;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      captureException(response.statusText, {
        tags: {
          section: 'marketing',
        },
        extra: {
          data,
        },
      });
      return new Response('Bad Request!', {
        status: 400,
        statusText: 'Bad Request',
      });
    }
    const result = await response.json();

    if (result.error_count > 0) {
      captureException(response.statusText, {
        tags: {
          section: 'marketing',
        },
        extra: {
          data,
          errors: result.errors,
        },
      });

      return new Response(
        JSON.stringify({
          message: 'Bad Request',
          errors: result.errors,
        }),
        {
          status: 400,
          statusText: 'Error encountered in email service',
        }
      );
    }

    return Response.json({
      message: 'user successfully added to bbop audiance',
      data: {
        created: result.total_created,
      },
    });
  } catch (error) {
    captureException(error, {
      tags: {
        section: 'marketing',
      },
      extra: {
        data,
      },
    });
    return new Response('ServerError: Adding user to bbop audiance failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
