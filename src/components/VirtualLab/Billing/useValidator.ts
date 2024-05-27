import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { z } from 'zod';
import find from 'lodash/find';

import {
  transactionFormStateAtom,
  virtualLabPaymentMethodsAtomFamily,
} from '@/state/virtual-lab/lab';

const creditFormValidatorSchema = z
  .object({
    credit: z
      .number()
      .or(z.string())
      .pipe(
        z.coerce
          .number({ message: 'Please enter a valid credit amount in dollars (e.g., 12.99)' })
          .gt(0, 'Credit amount must be greater than zero')
      ),
    defaultPaymentMethodId: z.string(),
    selectedPaymentMethodId: z.string().optional(),
  })
  .superRefine(({ defaultPaymentMethodId, selectedPaymentMethodId }, ctx) => {
    if (!defaultPaymentMethodId && !selectedPaymentMethodId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'please select your preferred payment method or ensure your default option is ready',
        path: ['paymentMethod'],
      });
    }
  });

export function transactionFormValidator({
  credit,
  defaultPaymentMethodId,
  selectedPaymentMethodId,
}: {
  credit?: string;
  defaultPaymentMethodId?: string;
  selectedPaymentMethodId?: string;
}) {
  const { success, data, error } = creditFormValidatorSchema.safeParse({
    credit,
    defaultPaymentMethodId,
    selectedPaymentMethodId,
  });
  return {
    isValid: success,
    payload: {
      credit: data?.credit,
      paymentMethodId: data?.selectedPaymentMethodId || data?.defaultPaymentMethodId,
    },
    error,
  };
}

export function useValidateTransactionForm(virtualLabId: string) {
  const { credit, selectedPaymentMethodId } = useAtomValue(transactionFormStateAtom);
  const paymentMethodsAtom = virtualLabPaymentMethodsAtomFamily(virtualLabId);
  const paymentMethods = useAtomValue(loadable(paymentMethodsAtom));

  const defaultPaymentMethodId =
    paymentMethods.state === 'hasData'
      ? find(paymentMethods.data, ['default', true])?.id
      : undefined;

  return useMemo(() => {
    return transactionFormValidator({
      credit,
      defaultPaymentMethodId,
      selectedPaymentMethodId,
    });
  }, [credit, selectedPaymentMethodId, defaultPaymentMethodId]);
}
