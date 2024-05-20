import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { PaymentMethod } from '@/types/virtual-lab/billing';
import { KeysToCamelCase } from '@/util/typing';
import {
  deletePaymentMethodToVirtualLab,
  updateDefaultPaymentMethodToVirtualLab,
} from '@/services/virtual-lab/billing';
import useNotification from '@/hooks/notifications';
import { basePath } from '@/config';
import ImageWithFallback from '@/components/ImageWithFallback';
import {
  transactionFormStateAtom,
  virtualLabPaymentMethodsAtomFamily,
} from '@/state/virtual-lab/lab';
import { classNames } from '@/util/utils';
import { useAccessToken } from '@/hooks/useAccessToken';

type Props = Pick<
  KeysToCamelCase<PaymentMethod>,
  'id' | 'cardNumber' | 'cardholderName' | 'brand'
> & {
  virtualLabId: string;
  isDefault: boolean;
};

export function PaymentMethodCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse items-center rounded-lg bg-gray-100 p-4 transition-colors duration-300 ease-out">
      <div className="mr-3 h-6 w-8 rounded bg-gray-200" />
      <div className="flex w-full min-w-0 justify-between gap-2">
        <div className="flex w-2/4 items-center gap-2">
          <div className="h-3 w-1/2 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="flex w-1/4 items-center gap-2">
          <div className="h-3 w-1/2 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodCard({
  id,
  cardholderName,
  cardNumber,
  virtualLabId,
  brand,
  isDefault,
}: Props) {
  const accessToken = useAccessToken();
  const { error: errorNotify, success: successNotify } = useNotification();
  const [isSettingDefaultLoading, setIsSettingDefaultLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const refreshPaymentMethods = useSetAtom(virtualLabPaymentMethodsAtomFamily(virtualLabId));
  const [{ selectedPaymentMethodId }, setTransactionFormState] = useAtom(transactionFormStateAtom);

  const isSelected = selectedPaymentMethodId === id;

  const onSelect = (pmId: string) => () => {
    setTransactionFormState((prev) => ({
      ...prev,
      selectedPaymentMethodId: prev.selectedPaymentMethodId === pmId ? undefined : pmId,
    }));
  };

  const onSetDefault = (pmId: string) => async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setIsSettingDefaultLoading(true);
      if (accessToken) {
        await updateDefaultPaymentMethodToVirtualLab(virtualLabId, accessToken, pmId);
        refreshPaymentMethods();
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
      if (accessToken) {
        await deletePaymentMethodToVirtualLab(virtualLabId, accessToken, pmId);
        refreshPaymentMethods();
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

  let containerStyle: string = 'bg-white text-primary-7';
  if (isDefault) containerStyle = 'bg-primary-0 border-primary-0';
  if (isSelected || (isDefault && isSelected))
    containerStyle = 'bg-primary-8 text-white hover:text-primary-8';

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    <div
      id={id}
      role="button"
      onClick={onSelect(id)}
      className={classNames(
        'group my-2 flex h-16 w-full items-center gap-5 rounded-md border border-neutral-3 p-5',
        'transition-colors duration-300 ease-out hover:border-primary-0 hover:bg-primary-0',
        containerStyle
      )}
    >
      <div className="grid grid-flow-col justify-center gap-2">
        <div className="relative h-5 w-8">
          <ImageWithFallback
            fill
            alt={brand}
            className="h-full w-full object-fill"
            src={`${basePath}/images/cards/${brand}.svg`}
            fallback={
              isSelected
                ? `${basePath}/images/cards/unknown-light.svg`
                : `${basePath}/images/cards/unknown-dark.svg`
            }
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
      {isSelected && (
        <div className="ml-auto select-none text-base text-white group-hover:hidden">Selected</div>
      )}
      <div className="ml-auto hidden items-center justify-center gap-2 group-hover:flex">
        {isDefault ? (
          <div className="select-none text-base text-primary-8">Default</div>
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
