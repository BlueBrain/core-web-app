import { useEffect } from 'react';
import { useResetAtom } from 'jotai/utils';

import { BalanceDetails, CreditForm, SubmitCredit } from './Balance';
import PaymentMethodsWidget from './PaymentMethodsList';
import { transactionFormStateAtom } from '@/state/virtual-lab/lab';

type Props = {
  virtualLabId: string;
};

export default function Billing({ virtualLabId }: Props) {
  const resetTransactionFormStateAtom = useResetAtom(transactionFormStateAtom);
  useEffect(() => resetTransactionFormStateAtom(), [resetTransactionFormStateAtom]);

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white px-7 py-7">
      <div className="w-full max-w-2xl">
        <BalanceDetails {...{ virtualLabId }} />
        <CreditForm {...{ virtualLabId }} />
        <PaymentMethodsWidget {...{ virtualLabId }} />
        <SubmitCredit {...{ virtualLabId }} />
      </div>
    </div>
  );
}
