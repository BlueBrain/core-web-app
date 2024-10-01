export default async function handleSubscriptionToMailChimp(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const API_KEY = process.env.NEXT_MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.NEXT_MAILCHIMP_AUDIENCE_ID;
  const DATACENTER = API_KEY.split('-')[1];

  const data = {
    members: [
      {
        email_address: email,
        status: 'pending',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
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

    if (response.status >= 400) {
      return res.status(400).json({
        message: 'There was an error subscribing to the list',
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
