import { feedbackUrl } from '@/config';

export default function postIssue(data = {}) {
  return fetch(feedbackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
