import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';

import PaymentMethodCard from './PaymentMethodCard';
import { virtualLabPaymentMethodsAtomFamily } from '@/state/virtual-lab/lab';

type Props = {
  virtualLabId: string;
};

export default function PaymentMethodsList({ virtualLabId }: Props) {
  const paymentMethodsAtom = virtualLabPaymentMethodsAtomFamily(virtualLabId);
  const paymentMethods = useAtomValue(loadable(paymentMethodsAtom));

  if (paymentMethods.state === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }
  if (paymentMethods.state === 'hasError' || !paymentMethods.data) {
    return (
      <div className="my-4 flex items-center justify-center">
        <div className="rounded-lg border p-8">
          Something went wrong when fetching virtual lab payment methods
        </div>
      </div>
    );
  }
  if (paymentMethods.data && !paymentMethods.data.length) {
    return (
      <div className="mb-2">
        <h3 className="text-base font-bold text-primary-8">Select payment method</h3>
        <p className="text-sm font-normal text-neutral-4">
          You will be able to select the card of your choice for either covering the monthly payment
          based on your selected plan or for the credit used on computation
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {paymentMethods.data.map((pm) => (
        <PaymentMethodCard
          key={pm.id}
          id={pm.id}
          cardholderName={pm.cardholder_name}
          cardNumber={pm.card_number}
          virtualLabId={virtualLabId}
        />
      ))}
    </div>
  );
}
