import { CreditCardOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { PaymentMethod } from '@/types/virtual-lab/billing';
import { KeysToCamelCase } from '@/util/typing';
import { updateDefaultPaymentMethodToVirtualLab } from '@/services/virtual-lab/billing';
import sessionAtom from '@/state/session';
import useNotification from '@/hooks/notifications';

type Props = Pick<KeysToCamelCase<PaymentMethod>, 'id' | 'cardNumber' | 'cardholderName'> & {
  virtualLabId: string;
}

export default function PaymentMethodCard({
  id,
  cardholderName,
  cardNumber,
  virtualLabId
}: Props) {
  const session = useAtomValue(sessionAtom);
  const { error: errorNotify, success: successNotify } = useNotification();
  const [isSettingDefaultLoading, setIsSettingDefaultLoading] = useState(false);

  const onSetDefault = (pmId: string) => async () => {
    try {
      setIsSettingDefaultLoading(true);
      if (session) {
        await updateDefaultPaymentMethodToVirtualLab(
          virtualLabId,
          session.accessToken,
          pmId
        );
        successNotify(`Success! Your card ending with ${cardNumber} is now your default payment method.`, undefined, "topRight");
      }
    } catch (error) {
      errorNotify(
        `There was a problem updating your default payment method, Please try again later.`,
        undefined,
        "topRight",
        true,
        virtualLabId
      );
    } finally {
      setIsSettingDefaultLoading(false);
    }
  }


  return (
    <div
      id={id}
      className="rounded-md border border-neutral-3 p-5 flex items-center justify-between gap-5 text-primary-7 w-full hover:bg-gray-100"
    >
      <div className='flex gap-2'>
        <CreditCardOutlined />
        <div className=''>
          **** **** **** <strong>{cardNumber}</strong>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <UserOutlined className='text-neutral-3' />
        <span>{cardholderName}</span></div>
      <Button
        type="text"
        htmlType='button'
        loading={isSettingDefaultLoading}
        onClick={onSetDefault(id)}
        className='ml-auto'
      >
        Choose
      </Button>
    </div>
  );
}
