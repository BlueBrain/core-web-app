import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { PaymentMethod } from '@/types/virtual-lab/billing';
import { KeysToCamelCase } from '@/util/typing';
import {
  deletePaymentMethodToVirtualLab,
  updateDefaultPaymentMethodToVirtualLab,
} from '@/services/virtual-lab/billing';
import sessionAtom from '@/state/session';
import useNotification from '@/hooks/notifications';
import { basePath } from '@/config';
import ImageWithFallback from '@/components/ImageWithFallback';

type Props = Pick<
  KeysToCamelCase<PaymentMethod>,
  'id' | 'cardNumber' | 'cardholderName' | 'default' | 'brand'
> & {
  virtualLabId: string;
};

export default function PaymentMethodCard({
  id,
  cardholderName,
  cardNumber,
  virtualLabId,
  default: defaultPaymentMethod,
  brand,
}: Props) {
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
      className="group flex h-20 w-full items-center gap-5 rounded-md border border-neutral-3 p-5 text-primary-7 hover:bg-gray-100"
    >
      <div className="grid grid-flow-col justify-center gap-2">
        <div className="relative h-5 w-8">
          <ImageWithFallback
            fill
            alt={brand}
            className="h-full w-full  object-fill"
            src={`${basePath}/images/cards/${brand}.svg`}
            fallback={`${basePath}/images/cards/unknown.svg`}
          />
        </div>
        <div className="w-full min-w-max text-base">
          **** **** **** <span>{cardNumber}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <UserOutlined className="text-base text-neutral-3" />
        <span className="text-base">{cardholderName}</span>
      </div>
      <div className="ml-auto hidden items-center justify-center group-hover:flex">
        {defaultPaymentMethod ? (
          <div className="text-primary-8">Default</div>
        ) : (
          <Button
            type="text"
            htmlType="button"
            loading={isSettingDefaultLoading}
            onClick={onSetDefault(id)}
            className="ml-auto"
          >
            Make it default
          </Button>
        )}
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
