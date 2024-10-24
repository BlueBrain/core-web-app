import { createApiHeaders } from './common';
import { PaymentMethod, VlabBalance, VlabBudgetTopup } from '@/types/virtual-lab/billing';
import { virtualLabApi } from '@/config';

type NewPaymentMethodPayload = {
  setupIntentId: string;
  name: string;
  email: string;
};

type NewBudgetTopUpPayload = {
  credit?: number;
  paymentMethodId?: string;
};

type VirtualLabPaymentMethodsResponse = {
  data: {
    virtual_lab_id: string;
    payment_methods: Array<PaymentMethod>;
  };
};

type VirtualLabBalanceResponse = {
  data: VlabBalance;
};

type VirtualLabCreditTopupResponse = {
  data: VlabBudgetTopup;
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
    headers: createApiHeaders(token),
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
    headers: createApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabBalanceDetails(
  id: string,
  token: string
): Promise<VirtualLabBalanceResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/billing/balance`, {
    method: 'GET',
    headers: createApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function addVirtualLabBudget(
  id: string,
  payload: NewBudgetTopUpPayload,
  token: string
): Promise<VirtualLabCreditTopupResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/billing/budget-topup`, {
    method: 'POST',
    headers: {
      ...createApiHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      credit: payload.credit,
      payment_method_id: payload.paymentMethodId,
    }),
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
      ...createApiHeaders(token),
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
        ...createApiHeaders(token),
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
      headers: createApiHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
