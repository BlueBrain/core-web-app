import { blueNaasUrl } from '@/config';

export default async function validateSynapseGenerationFormula(
  formula: string,
  token: string
): Promise<boolean> {
  const response = await fetch(`${blueNaasUrl}/validation/synapse-formula`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formula,
    }),
  });
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Formula validation failed');
}
