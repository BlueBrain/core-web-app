import { PaymentElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { ComponentProps, FormEvent, useReducer, useState, useEffect, useRef } from 'react';
import { Button, ConfigProvider } from 'antd';
import { Stripe } from '@stripe/stripe-js';

import getStripe, { getErrorMessage } from './getStripe';
import useNotification from '@/hooks/notifications';
import { classNames } from '@/util/utils';
import LoadingIcon from '@/components/icons/LoadingIcon';
import { StripeSetup } from '@/types/stripe';
import {
  createStripeSetupIntent,
  updateStripeCustomer,
  updateVirtualLabPaymentMethods,
} from '@/services/virtual-lab/billing';

type Props = {
  virtualLabId: string;
};

type PaymentFormState = {
  loading: boolean;
  error: string | null;
};

function StripeInput({ title, id, name, ...props }: ComponentProps<'input'> & { title: string }) {
  return (
    <div className="mb-3">
      <label
        htmlFor={name}
        className="mb-1 w-full text-[16px] text-[#30313d]"
        style={{
          transition:
            'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        {title}
        <input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          id={id}
          name={name}
          className={classNames(
            'w-full rounded-[5px] border border-solid border-[#e6e6e6] bg-white p-3',
            'shadow-[0px_1px_1px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.02)]'
          )}
          style={{
            transition:
              'background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
          }}
        />
      </label>
    </div>
  );
}

export function Form({ virtualLabId, customerId }: { customerId: string; virtualLabId: string }) {
  const [stripeElementsReady, setStipeElementsReady] = useState(false);

  const elements = useElements();
  const stripe = useStripe();
  const { error: errorNotify } = useNotification();
  const [formState, setFormState] = useReducer(
    (prev: PaymentFormState, next: Partial<PaymentFormState>) => ({
      ...prev,
      ...next,
    }),
    {
      loading: false,
      error: null,
    }
  );
  const formLoaded = stripe && elements;
  const disableForm = !formLoaded || formState.loading;

  const onStripeElementsReady = () => setStipeElementsReady(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState({ loading: true });

    const target = event.currentTarget;
    const formData = new FormData(target);
    const name = String(formData.get('cardholder-name'));
    const email = String(formData.get('cardholder-email'));

    if (!stripe || !elements) {
      return null;
    }

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.href,
        },
      });

      if (error) {
        errorNotify(error.message!);
        setFormState({
          error: error.message,
        });
      } else {
        const customer = await updateStripeCustomer({
          customerId,
          name,
          email,
        });

        await updateVirtualLabPaymentMethods({
          virtualLabId,
          customerId: customer.id,
          name,
          email,
          setupIntent: setupIntent.id,
        });
      }
    } catch (error) {
      errorNotify(getErrorMessage(error));
      setFormState({
        error: getErrorMessage(error),
      });
    } finally {
      setFormState({ loading: false });
      elements.getElement('payment')?.clear();
      target.reset();
    }
  };

  return (
    <form name="stripe-payment-method-form" className="mx-auto max-w-[50%]" onSubmit={handleSubmit}>
      {stripeElementsReady && (
        <>
          <div className="w-full">
            <StripeInput
              id="cardholder-email"
              name="cardholder-email"
              type="email"
              title="Email"
              required
            />
          </div>
          <div className="w-full">
            <StripeInput
              id="cardholder-name"
              name="cardholder-name"
              type="text"
              title="Cardholder name"
              required
            />
          </div>
        </>
      )}
      <PaymentElement onReady={onStripeElementsReady} />
      {stripeElementsReady && (
        <ConfigProvider theme={{ hashed: false }}>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className="my-4 w-full rounded-md bg-[#2B75CD] text-center text-xl font-semibold capitalize text-[#A1C6EA]"
            disabled={disableForm}
            loading={formState.loading}
          >
            Save card details
          </Button>
        </ConfigProvider>
      )}
    </form>
  );
}

export default function PaymentForm({ virtualLabId }: Props) {
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [{ clientSecret, customerId }, setStripeSetupObject] = useState<StripeSetup>({
    clientSecret: '',
    customerId: '',
    intentId: '',
  });
  const stripeRef = useRef(false);

  useEffect(() => {
    async function initializeStripe() {
      const [stripeSetup, stripeObject] = await Promise.all([
        createStripeSetupIntent({
          virtualLabId,
        }),
        getStripe(),
      ]);
      setStripePromise(stripeObject);
      setStripeSetupObject(stripeSetup);
    }

    if (virtualLabId && !stripeRef.current) {
      initializeStripe();
      stripeRef.current = true;
    }
  }, [virtualLabId]);

  if (!clientSecret) return <LoadingIcon />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        fonts: [
          {
            family: 'Titillium Web',
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap',
          },
        ],
        appearance: {
          variables: {
            fontFamily: 'Titillium Web',
            fontSizeSm: '1rem',
          },
          rules: {
            '.Input:focus': {
              boxShadow:
                '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px #0050B3',
              borderColor: 'none',
            },
          },
        },
      }}
    >
      <Form {...{ customerId, virtualLabId }} />
    </Elements>
  );
}