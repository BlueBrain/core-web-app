import { createVLApiHeaders } from './common';
import { PaymentMethod } from '@/types/virtual-lab/billing';
import { virtualLabApi } from '@/config';

type NewPaymentMethodPayload = {
  setupIntentId: string;
  name: string;
  email: string;
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

type DeletedVirtualLabPaymentMethodResponse = {
  data: {
    virtual_lab_id: string;
    payment_method_id: string;
    deleted: boolean;
    deleted_at: string;
  };
};

export type SetupIntentResponse = {
  data: {
    id: string;
    client_secret: string;
    customer_id: string;
  };
};

export async function generateSetupIntent(id: string, token: string): Promise<SetupIntentResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/billing/setup-intent`, {
    method: 'POST',
    headers: createVLApiHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
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

export async function addNewPaymentMethodToVirtualLab(
  id: string,
  token: string,
  payload: NewPaymentMethodPayload
): Promise<AddVirtualLabPaymentMethodResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/billing/payment-methods`, {
    method: 'POST',
    headers: {
      ...createVLApiHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function updateDefaultPaymentMethodToVirtualLab(
  id: string,
  token: string,
  paymentMethodId: string
): Promise<AddVirtualLabPaymentMethodResponse> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${id}/billing/payment-methods/default`,
    {
      method: 'PATCH',
      headers: {
        ...createVLApiHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    }
  );

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function deletePaymentMethodToVirtualLab(
  id: string,
  token: string,
  paymentMethodId: string
): Promise<DeletedVirtualLabPaymentMethodResponse> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${id}/billing/payment-methods/${paymentMethodId}`,
    {
      method: 'DELETE',
      headers: createVLApiHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
