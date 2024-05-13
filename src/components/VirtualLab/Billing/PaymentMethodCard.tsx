import { CreditCardOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { PaymentMethod } from '@/types/virtual-lab/billing';
import { KeysToCamelCase } from '@/util/typing';
import { deletePaymentMethodToVirtualLab, updateDefaultPaymentMethodToVirtualLab } from '@/services/virtual-lab/billing';
import sessionAtom from '@/state/session';
import useNotification from '@/hooks/notifications';

type Props = Pick<KeysToCamelCase<PaymentMethod>, 'id' | 'cardNumber' | 'cardholderName' | 'default'> & {
  virtualLabId: string;
};

export default function PaymentMethodCard({ id, cardholderName, cardNumber, virtualLabId, default: defaultPaymentMethod }: Props) {
  const session = useAtomValue(sessionAtom);
  const { error: errorNotify, success: successNotify } = useNotification();
  const [isSettingDefaultLoading, setIsSettingDefaultLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onSetDefault = (pmId: string) => async () => {
    try {
      setIsSettingDefaultLoading(true);
      if (session) {
        await updateDefaultPaymentMethodToVirtualLab(virtualLabId, session.accessToken, pmId);
        successNotify(
          `Success! Your card ending with ${cardNumber} is now your default payment method.`,
          undefined,
          'topRight'
        );
      }
    } catch (error) {
      errorNotify(
        `There was a problem updating your default payment method, Please try again later.`,
        undefined,
        'topRight',
        true,
        virtualLabId
      );
    } finally {
      setIsSettingDefaultLoading(false);
    }
  };

  const onDeletePaymentMethod = (pmId: string) => async () => {
    try {
      setIsDeleteLoading(true);
      if (session) {
        await deletePaymentMethodToVirtualLab(virtualLabId, session.accessToken, pmId);
        successNotify(
          `Success! Your card ending with ${cardNumber} is deleted.`,
          undefined,
          'topRight'
        );
      }
    } catch (error) {
      errorNotify(
        `There was a problem deleting the payment method, Please try again later.`,
        undefined,
        'topRight',
        true,
        virtualLabId
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div
      id={id}
      className="flex group w-full items-center justify-between gap-5 rounded-md border border-neutral-3 p-5 text-primary-7 hover:bg-gray-100"
    >
      <div className="flex gap-2">
        <CreditCardOutlined />
        <div className="">
          **** **** **** <strong>{cardNumber}</strong>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <UserOutlined className="text-neutral-3" />
        <span>{cardholderName}</span>
      </div>
      <div className='hidden group-hover:flex items-center justify-center self-end'>
        {defaultPaymentMethod ? <div className='text-primary-8'>
          Default
        </div> :
          <Button
            type="text"
            htmlType="button"
            loading={isSettingDefaultLoading}
            onClick={onSetDefault(id)}
            className="ml-auto"
          >
            Make it default
          </Button>}
        <Button
          danger
          type="text"
          htmlType="button"
          loading={isDeleteLoading}
          onClick={onDeletePaymentMethod(id)}
          className="ml-auto"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
