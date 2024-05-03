import PaymentForm from './PaymentForm';
import PaymentMethodsList from './PaymentMethodsList';

type Props = {
  virtualLabId: string;
};

export default function Billing({ virtualLabId }: Props) {
  return (
    <div className="w-full bg-white py-7">
      <PaymentMethodsList {...{ virtualLabId }} />
      <PaymentForm {...{ virtualLabId }} />
    </div>
  );
}
