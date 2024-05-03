import { CreditCardOutlined, LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Spin } from 'antd';

import { PaymentMethod } from '@/types/virtual-lab/billing';
import { KeysToCamelCase } from '@/util/typing';
import { virtualLabPaymentMethodsAtomFamily } from '@/state/virtual-lab/lab';

function PaymentMethodCard({
  id,
  cardholderName,
  cardNumber,
  expireAt,
}: Pick<KeysToCamelCase<PaymentMethod>, 'id' | 'cardNumber' | 'cardholderName' | 'expireAt'>) {
  return (
    <div id={id} className="mb-3 rounded-md border-primary-5 ">
      <CreditCardOutlined />
      <div>{cardholderName}</div>
      <div>
        {cardNumber}, {expireAt}
      </div>
    </div>
  );
}

export default function PaymentMethodsList({ virtualLabId }: { virtualLabId: string }) {
  const paymentMethodsAtom = virtualLabPaymentMethodsAtomFamily(virtualLabId);
  const paymentMethods = useAtomValue(loadable(paymentMethodsAtom));

  if (paymentMethods.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
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

  return (
    <div className="grid grid-flow-col gap-2">
      {paymentMethods.data.map((pm) => (
        <PaymentMethodCard
          key={pm.id}
          id={pm.id}
          cardholderName={pm.cardholder_name}
          cardNumber={pm.card_number}
          expireAt={pm.expire_at}
        />
      ))}
    </div>
  );
}
