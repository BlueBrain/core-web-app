import { createVLApiHeaders } from './common';
import { PaymentMethod } from '@/types/virtual-lab/billing';
import { virtualLabApi } from '@/config';
import { StripeCustomer, StripeSetup } from '@/types/stripe';

type NewPaymentMethodPayload = {
  customerId: string;
  paymentMethodId: string;
  name: string;
  email: string;
  brand?: string;
  expireAt?: string;
  last4?: string;
};

type VirtualLabPaymentMethodsResponse = {
  data: {
    virtual_lab_id: string;
    payment_methods: Array<PaymentMethod>;
  };
};

type AddVirtualLabPaymentMethodResponse = {
  data: {
    virtual_lab_id: string;
    payment_method: PaymentMethod;
  };
};

export async function createStripeSetupIntent({
  virtualLabId,
}: {
  virtualLabId: string;
}): Promise<StripeSetup> {
  const data = await fetch('/api/billing/setup', {
    method: 'POST',
    body: JSON.stringify({
      virtualLabId,
    }),
  });
  const result: StripeSetup = await data.json();
  return result;
}

export async function updateStripeCustomer({
  customerId,
  name,
  email,
}: {
  customerId: string;
  name: string;
  email: string;
}): Promise<StripeCustomer> {
  const data = await fetch('/api/billing/customer', {
    method: 'POST',
    body: JSON.stringify({
      customerId,
      name,
      email,
    }),
  });
  const result: StripeCustomer = await data.json();
  return result;
}

export async function updateVirtualLabPaymentMethods({
  customerId,
  virtualLabId,
  setupIntent,
  name,
  email,
}: {
  customerId: string;
  virtualLabId: string;
  setupIntent: string;
  name: string;
  email: string;
}): Promise<StripeCustomer> {
  const data = await fetch('/api/billing/vlab/payment-methods', {
    method: 'POST',
    body: JSON.stringify({
      virtualLabId,
      customerId,
      setupIntent,
      name,
      email,
    }),
  });
  const result: StripeCustomer = await data.json();
  return result;
}

export async function getVirtualLabPaymentMethods(
  id: string,
  token: string
): Promise<VirtualLabPaymentMethodsResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/billing/payment-methods`, {
    method: 'GET',
    headers: createVLApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function AddNewPaymentMethodToVirtualLab(
  id: string,
  token: string,
  payload: NewPaymentMethodPayload
): Promise<AddVirtualLabPaymentMethodResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/billing/payment-methods`, {
    method: 'GET',
    headers: createVLApiHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
