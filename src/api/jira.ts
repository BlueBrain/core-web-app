const API_URL = 'https://bbp.epfl.ch/mmb-beta/api/jira';

export default function postIssue(data = {}) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
