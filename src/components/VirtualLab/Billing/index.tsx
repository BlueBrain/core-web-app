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
    <div className="w-full bg-white py-7 px-7 flex flex-col items-center justify-center">
      <div className='max-w-2xl w-full'>
        <div className='py-3'>
          <PaymentMethodsList virtualLabId={virtualLabId} />
          {!openStripeForm && (
            <button
              className="rounded-md border border-neutral-3 !p-5 flex items-center justify-between gap-3 text-primary-7 w-full mt-2 hover:bg-gray-100"
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
                toggleOpenStripeForm
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
