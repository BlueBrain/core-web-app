import { useReducer, useRef, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { Loadable } from 'jotai/vanilla/utils/loadable';

import PaymentForm from './PaymentForm';
import { ADDING_NEW_PAYMENT_METHOD_DESCRIPTION, FETCHING_PAYMENT_METHODS_FAILED } from './messages';
import PaymentMethodCard, { PaymentMethodCardSkeleton } from './PaymentMethodCard';
import { virtualLabPaymentMethodsAtomFamily } from '@/state/virtual-lab/lab';
import { PaymentMethod } from '@/types/virtual-lab/billing';
import { classNames } from '@/util/utils';

type Props = {
  virtualLabId: string;
};

type PaymentMethodsListProps = {
  virtualLabId: string;
  showCardsList: boolean;
  paymentMethods: Loadable<Promise<PaymentMethod[] | undefined>>;
};

function FormWidget({ virtualLabId }: Props) {
  const [showStripeForm, toggleOpenStripeForm] = useState(false);
  const openStripeForm = () => toggleOpenStripeForm(true);
  return showStripeForm ? (
    <PaymentForm
      {...{
        virtualLabId,
        toggleOpenStripeForm,
      }}
    />
  ) : (
    <button
      type="button"
      className={classNames(
        'mt-2 flex h-16 w-full items-center justify-between gap-3 rounded-md border border-neutral-3 !p-5 text-primary-7',
        'transition-colors duration-300 ease-out hover:border-primary-0 hover:bg-primary-0'
      )}
      onClick={openStripeForm}
    >
      <span>Add card</span>
      <PlusOutlined />
    </button>
  );
}

function PaymentMethodsList({
  virtualLabId,
  showCardsList,
  paymentMethods,
}: PaymentMethodsListProps) {
  const previousCardsCount = useRef(
    paymentMethods.state === 'hasData' ? paymentMethods.data?.length : 1
  );

  if (paymentMethods.state === 'loading') {
    return (
      <div className="flex w-full flex-col gap-2">
        {Array(previousCardsCount.current)
          .fill('')
          .map((i) => (
            <PaymentMethodCardSkeleton key={`payment-method-card-${i}`} />
          ))}
      </div>
    );
  }
  if (paymentMethods.state === 'hasError' || !paymentMethods.data) {
    return (
      <div className="my-4 inline-flex w-full min-w-0">
        <div className="rounded-lg border p-8">{FETCHING_PAYMENT_METHODS_FAILED}</div>
      </div>
    );
  }

  const defaultPaymentMethod = find(paymentMethods.data, ['default', true]);
  const remainingPaymentMethods = filter(paymentMethods.data, ['default', false]);
  previousCardsCount.current = paymentMethods.data.length + 1;

  return (
    <>
      {defaultPaymentMethod && (
        <PaymentMethodCard
          key={`default-${defaultPaymentMethod.id}`}
          id={defaultPaymentMethod.id}
          virtualLabId={virtualLabId}
          cardholderName={defaultPaymentMethod.cardholder_name}
          cardNumber={defaultPaymentMethod.card_number}
          brand={defaultPaymentMethod.brand}
          isDefault={defaultPaymentMethod.default}
        />
      )}
      <div className={classNames('w-full', showCardsList && 'animate-fade-in')}>
        {showCardsList && (
          <>
            {orderBy(remainingPaymentMethods, ['default'], ['desc']).map((pm) => (
              <PaymentMethodCard
                key={pm.id}
                id={pm.id}
                cardholderName={pm.cardholder_name}
                cardNumber={pm.card_number}
                virtualLabId={virtualLabId}
                brand={pm.brand}
                isDefault={pm.default}
              />
            ))}
            <FormWidget {...{ virtualLabId }} />
          </>
        )}
      </div>
    </>
  );
}

export default function PaymentMethodsWidget({ virtualLabId }: Props) {
  const [showCardsList, toggleShowCardsList] = useReducer((prev) => !prev, false);
  const paymentMethods = useAtomValue(loadable(virtualLabPaymentMethodsAtomFamily(virtualLabId)));

  if (paymentMethods.state === 'hasData' && paymentMethods.data && !paymentMethods.data.length) {
    return (
      <div className="my-7 w-full">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-primary-8">Add a New Payment Method</h3>
          <p className="text-base font-normal text-neutral-4">
            {ADDING_NEW_PAYMENT_METHOD_DESCRIPTION}
          </p>
        </div>
        <FormWidget {...{ virtualLabId }} />
      </div>
    );
  }

  return (
    <div className="mt-10 w-full py-5">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="text-base font-bold">Payment methods</div>
        <Button
          htmlType="button"
          type="text"
          className="flex items-center justify-center gap-px text-base font-normal"
          onClick={toggleShowCardsList}
        >
          Manage cards
          {showCardsList && <CloseOutlined className="text-sm text-gray-300" />}
        </Button>
      </div>
      <PaymentMethodsList {...{ virtualLabId, showCardsList, paymentMethods }} />
    </div>
  );
}
