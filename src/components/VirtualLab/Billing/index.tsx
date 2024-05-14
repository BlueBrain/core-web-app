import { useReducer } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import PaymentForm from './PaymentForm';
import PaymentMethodsList from './PaymentMethodsList';

type Props = {
  virtualLabId: string;
};

export default function Billing({ virtualLabId }: Props) {
  const [openStripeForm, toggleOpenStripeForm] = useReducer((val) => !val, false);

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white px-7 py-7">
      <div className="w-full max-w-2xl">
        <div className="py-3">
          <PaymentMethodsList virtualLabId={virtualLabId} />
          {!openStripeForm && (
            <button
              className="mt-2 flex w-full items-center justify-between gap-3 rounded-md border border-neutral-3 !p-5 text-primary-7 hover:border-primary-0 hover:bg-primary-0"
              type="button"
              onClick={toggleOpenStripeForm}
            >
              <span>Add card</span>
              <PlusOutlined />
            </button>
          )}
        </div>
        {openStripeForm && (
          <>
            <Divider />
            <PaymentForm
              {...{
                virtualLabId,
                toggleOpenStripeForm,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
