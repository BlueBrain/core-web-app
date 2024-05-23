import { ChangeEventHandler, FormEventHandler, useEffect } from 'react';
import { Button, Skeleton } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { loadable, useResetAtom } from 'jotai/utils';
import { useRouter } from 'next/navigation';
import { parseAsString, useQueryStates } from 'nuqs';
import find from 'lodash/find';
import kebabCase from 'lodash/kebabCase';

import getStripe, { formatCurrency } from './utils';
import {
  PROCESSING_TRANSACTION_FAILED,
  TRANSACTION_AFTER_REDIRECTION_SUCCEEDED,
  TRANSACTION_FAILED,
  TRANSACTION_SUCCEEDED,
  VALIDATE_PAYMENT_INTENT_FAILED,
} from './messages';
import { transactionFormValidator, useValidateTransactionForm } from './useValidator';
import useNotification from '@/hooks/notifications';
import {
  transactionFormStateAtom,
  virtualLabBalanceAtomFamily,
  virtualLabPaymentMethodsAtomFamily,
} from '@/state/virtual-lab/lab';
import { addVirtualLabBudget } from '@/services/virtual-lab/billing';
import { classNames } from '@/util/utils';
import { KeysToCamelCase } from '@/util/typing';
import { VlabBalance } from '@/types/virtual-lab/billing';
import { useAccessToken } from '@/hooks/useAccessToken';

type Props = {
  virtualLabId: string;
};

const BILLING_FORM_NAME = 'add-credit-form';

export function CreditForm({ virtualLabId }: Props) {
  const token = useAccessToken();
  const { replace: redirect } = useRouter();
  const { error: errorNotify, success: successNotify } = useNotification();
  const refreshBalanceResult = useSetAtom(virtualLabBalanceAtomFamily(virtualLabId));
  const [{ credit, selectedPaymentMethodId, errors }, setTransactionFormState] =
    useAtom(transactionFormStateAtom);
  const paymentMethods = useAtomValue(loadable(virtualLabPaymentMethodsAtomFamily(virtualLabId)));
  const resetTransactionFormStateAtom = useResetAtom(transactionFormStateAtom);

  const [
    { payment_intent_client_secret: paymentIntentClientSecret },
    setPaymentIntentAfterRedirection,
  ] = useQueryStates(
    {
      payment_intent: parseAsString.withDefault(''),
      payment_intent_client_secret: parseAsString.withDefault(''),
      source_type: parseAsString.withDefault(''),
    },
    { clearOnDefault: true }
  );

  const defaultPaymentMethodId =
    paymentMethods.state === 'hasData'
      ? find(paymentMethods.data, ['default', true])?.id
      : undefined;

  const onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { error } = transactionFormValidator({
      credit: event.target.value,
      selectedPaymentMethodId,
      defaultPaymentMethodId,
    });

    const errs = error?.flatten().fieldErrors;
    setTransactionFormState((prev) => ({
      ...prev,
      credit: event.target.value,
      errors: errs?.credit?.length ? errs : undefined,
    }));
  };

  const onResetTransactionFrom: FormEventHandler<HTMLFormElement> = () => {
    resetTransactionFormStateAtom();
  };

  const onSubmitTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTransactionFormState((prev) => ({ ...prev, loading: true }));

    const formData = new FormData(e.currentTarget);

    const { isValid, payload } = transactionFormValidator({
      credit: String(formData.get('credit')),
      selectedPaymentMethodId: String(formData.get('selected-payment-method')),
      defaultPaymentMethodId: String(formData.get('default-payment-method')),
    });

    try {
      if (token && isValid && payload) {
        const { data } = await addVirtualLabBudget(virtualLabId, payload, token);
        if (data.status === 'succeeded') {
          refreshBalanceResult();
          successNotify(TRANSACTION_SUCCEEDED, undefined, 'topRight', true, virtualLabId);
        } else if (
          data.status === 'requires_action' &&
          data.next_action &&
          data.next_action.type === 'redirect_to_url' &&
          data.next_action.redirect_to_url?.url
        ) {
          redirect(data.next_action.redirect_to_url.url);
        } else {
          errorNotify(TRANSACTION_FAILED, undefined, 'topRight', true, virtualLabId);
        }
      }
    } catch (er) {
      errorNotify(PROCESSING_TRANSACTION_FAILED, undefined, 'topRight', true, virtualLabId);
    } finally {
      resetTransactionFormStateAtom();
    }
  };

  useEffect(() => {
    (async () => {
      if (paymentIntentClientSecret) {
        const stripe = await getStripe();
        if (stripe) {
          const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
          if (paymentIntent?.last_payment_error) {
            errorNotify(
              `Oops, ${paymentIntent.last_payment_error.message ?? VALIDATE_PAYMENT_INTENT_FAILED}`,
              undefined,
              'topRight',
              true,
              virtualLabId
            );
          } else if (paymentIntent?.status === 'succeeded') {
            refreshBalanceResult();
            successNotify(
              TRANSACTION_AFTER_REDIRECTION_SUCCEEDED.replace(
                '$$',
                formatCurrency(paymentIntent.amount / 100)
              ),
              undefined,
              'topRight',
              true,
              virtualLabId
            );
          }
        }
        setPaymentIntentAfterRedirection({
          payment_intent: '',
          payment_intent_client_secret: '',
          source_type: '',
        });
      }
    })();
  }, [
    errorNotify,
    successNotify,
    setPaymentIntentAfterRedirection,
    refreshBalanceResult,
    paymentIntentClientSecret,
    virtualLabId,
  ]);

  return (
    <div className="inline-flex w-full min-w-full items-center bg-white py-4">
      <div className="mr-4 min-w-max text-base font-bold text-primary-7">Add credit:</div>
      <form
        noValidate
        id={BILLING_FORM_NAME}
        name={BILLING_FORM_NAME}
        onSubmit={onSubmitTransaction}
        onReset={onResetTransactionFrom}
        className="w-full"
      >
        <input
          hidden
          readOnly
          id="selected-payment-method"
          name="selected-payment-method"
          form={BILLING_FORM_NAME}
          type="text"
          value={selectedPaymentMethodId ?? ''}
        />
        <input
          hidden
          readOnly
          id="default-payment-method"
          name="default-payment-method"
          form={BILLING_FORM_NAME}
          type="text"
          value={defaultPaymentMethodId ?? ''}
        />
        <div className="relative w-full">
          <div
            className={classNames(
              'group flex flex-grow items-center gap-2 rounded-lg border border-gray-300 p-4',
              !!errors?.credit?.length &&
                'border-rose-600 shadow-[0px_1px_1px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.02),0_0_0_1px_#df1b41]'
            )}
          >
            <span className="text-lg text-blue-700">$</span>
            <input
              id="credit"
              name="credit"
              form={BILLING_FORM_NAME}
              type="number"
              min={0}
              placeholder="Enter credit here"
              value={credit}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={onChange}
              className={classNames(
                'peer ml-2 flex-grow text-2xl font-bold text-primary-8 outline-none',
                'placeholder:text-base placeholder:font-light placeholder:text-gray-600'
              )}
            />
            {errors &&
              errors.credit &&
              errors.credit.map((err, i) => (
                <div
                  key={`error-credit-${kebabCase(err)}`}
                  className="absolute left-0 flex text-sm text-rose-600"
                  style={{ bottom: `calc(-1.7rem - ${i}rem)` }}
                >
                  {err}
                </div>
              ))}
          </div>
        </div>
      </form>
    </div>
  );
}

function BalanceDetailsCard(
  props:
    | KeysToCamelCase<VlabBalance>
    | {
        loading: boolean;
      }
) {
  return (
    <div className="flex items-center justify-between border border-gray-300 bg-white px-8 py-8 shadow-sm">
      <div>
        <div className="text-sm text-primary-7">Your current credit balance:</div>
        <div className="text-4xl font-bold text-primary-8">
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {'loading' in props ? <Skeleton.Button active /> : formatCurrency(props.budget)}
        </div>
      </div>
      <div>
        <div className="text-sm text-neutral-4">Total spent:</div>
        <div className="text-4xl font-bold text-neutral-4">
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {'loading' in props ? <Skeleton.Button active /> : formatCurrency(props.totalSpent)}
        </div>
      </div>
    </div>
  );
}

export function BalanceDetails({ virtualLabId }: Props) {
  const balanceAtom = virtualLabBalanceAtomFamily(virtualLabId);
  const balanceResult = useAtomValue(loadable(balanceAtom));

  if (balanceResult.state === 'loading') {
    return <BalanceDetailsCard loading />;
  }
  if (balanceResult.state === 'hasError') {
    return (
      <div className="my-4 inline-flex w-full min-w-0">
        <div className="w-full rounded-lg border p-8">
          Something went wrong when fetching virtual lab balance
        </div>
      </div>
    );
  }
  if (!balanceResult.data) {
    return null;
  }

  const { budget, total_spent: totalSpent } = balanceResult.data;

  return (
    <BalanceDetailsCard
      {...{
        virtualLabId,
        budget,
        totalSpent,
      }}
    />
  );
}

export function SubmitCredit({ virtualLabId }: Props) {
  const { loading } = useAtomValue(transactionFormStateAtom);
  const { isValid } = useValidateTransactionForm(virtualLabId);

  const disableProceedPayment = !isValid || loading;

  return (
    <div className="ml-auto flex w-full items-center justify-end gap-2 py-5">
      <Button
        htmlType="reset"
        size="large"
        type="text"
        form={BILLING_FORM_NAME}
        className="rounded-none"
      >
        Cancel
      </Button>
      <Button
        htmlType="submit"
        form={BILLING_FORM_NAME}
        size="large"
        loading={loading}
        disabled={disableProceedPayment}
        className="rounded-none border-primary-8 bg-primary-8 text-white"
      >
        Proceed to payment
      </Button>
    </div>
  );
}
