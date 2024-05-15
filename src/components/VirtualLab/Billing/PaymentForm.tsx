import { PaymentElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  ComponentProps,
  FormEvent,
  useState,
  useEffect,
  useRef,
  DispatchWithoutAction,
  ChangeEvent,
} from 'react';
import { Button, ConfigProvider, Spin } from 'antd';
import { Stripe } from '@stripe/stripe-js';

import { useAtomValue, useSetAtom } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import z from 'zod';

import getStripe, { getErrorMessage } from './getStripe';
import useNotification from '@/hooks/notifications';
import { classNames, getZodErrorPath, isStringEmpty } from '@/util/utils';
import {
  SetupIntentResponse,
  addNewPaymentMethodToVirtualLab,
  generateSetupIntent,
} from '@/services/virtual-lab/billing';
import sessionAtom from '@/state/session';
import { virtualLabPaymentMethodsAtomFamily } from '@/state/virtual-lab/lab';
import { useAccessToken } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-campaign-descriptor';

type PaymentFormProps = {
  virtualLabId: string;
  toggleOpenStripeForm: DispatchWithoutAction;
};

const CardholderValidation = z.object({
  name: z.string(),
  email: z.string().email(),
});

type Cardholder = z.infer<typeof CardholderValidation>;
type CardholderKeys = keyof Cardholder;

function StripeInput({
  title,
  id,
  name,
  value,
  error,
  ...props
}: ComponentProps<'input'> & { title: string; error: boolean }) {
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
          value={value}
          className={classNames(
            'h-[44px] w-full rounded-[5px] border  border-solid bg-white p-3',
            error
              ? 'border-rose-600 shadow-[0px_1px_1px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.02),0_0_0_1px_#df1b41]'
              : 'border-neutral-200 shadow-[0px_1px_1px_rgba(0,0,0,0.03),0px_3px_6px_rgba(0,0,0,0.02)]'
          )}
          style={{
            transition:
              'background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
          }}
        />
        {error && (
          <p className="mt-1 text-[16px] text-rose-600" role="alert">
            Your {id} is invalid.
          </p>
        )}
      </label>
    </div>
  );
}

export function Form({ virtualLabId, toggleOpenStripeForm }: PaymentFormProps) {
  const accessToken = useAccessToken();
  const elements = useElements();
  const stripe = useStripe();
  const { error: errorNotify } = useNotification();
  const refreshPaymentMethods = useSetAtom(virtualLabPaymentMethodsAtomFamily(virtualLabId));
  const [stripeElementsReady, setStipeElementsReady] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [cardholderForm, setCardHolderForm] = useState<Cardholder>({
    name: '',
    email: '',
  });
  const [cardholderFormErrorKeys, setCardholderFormErrorKeys] = useState<Array<CardholderKeys>>([]);

  const onCardholderChange = (key: CardholderKeys) => (e: ChangeEvent<HTMLInputElement>) =>
    setCardHolderForm((state) => ({ ...state, [key]: e.target.value }));

  const onCardholderBlur = (key: CardholderKeys) => async () => {
    const validation = await CardholderValidation.safeParseAsync(cardholderForm);
    if (
      (!validation.success && getZodErrorPath(validation.error).includes(key)) ||
      isStringEmpty(cardholderForm[key])
    ) {
      setCardholderFormErrorKeys((state) => [...state, key]);
    } else {
      setCardholderFormErrorKeys((state) => state.filter((e) => e !== key));
    }
  };

  const formLoaded = stripe && elements;
  const disableForm = !formLoaded || formLoading;

  const onStripeElementsReady = () => setStipeElementsReady(true);

  const handlePaymentMethodSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);

    const { name, email } = cardholderForm;

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
        errorNotify(error.message!, undefined, 'topRight', true);
      } else if (accessToken) {
        await addNewPaymentMethodToVirtualLab(virtualLabId, accessToken, {
          name,
          email,
          setupIntentId: setupIntent.id,
        });
        toggleOpenStripeForm();
        refreshPaymentMethods();
      }
    } catch (error) {
      errorNotify(getErrorMessage(error));
    } finally {
      setFormLoading(false);
      setCardHolderForm({ name: '', email: '' });
      setCardholderFormErrorKeys([]);
      elements.getElement('payment')?.clear();
    }
  };

  return (
    <form
      name="stripe-payment-method-form"
      className="mx-auto w-full max-w-2xl"
      onSubmit={handlePaymentMethodSubmit}
    >
      {stripeElementsReady && (
        <>
          <div className="w-full">
            <StripeInput
              type="email"
              id="email"
              name="email"
              title="Email"
              value={cardholderForm.email}
              onChange={onCardholderChange('email')}
              error={cardholderFormErrorKeys.includes('email')}
              onBlur={onCardholderBlur('email')}
            />
          </div>
          <div className="w-full">
            <StripeInput
              type="text"
              id="name"
              name="name"
              title="Cardholder name"
              value={cardholderForm.name}
              error={cardholderFormErrorKeys.includes('name')}
              onChange={onCardholderChange('name')}
              onBlur={onCardholderBlur('name')}
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
            className="my-4 w-full rounded-md bg-primary-8 text-center text-xl font-semibold capitalize text-primary-3"
            disabled={disableForm}
            loading={formLoading}
          >
            Save card details
          </Button>
        </ConfigProvider>
      )}
    </form>
  );
}

export default function PaymentForm({ virtualLabId, toggleOpenStripeForm }: PaymentFormProps) {
  const stripeRef = useRef(false);
  const session = useAtomValue(sessionAtom);
  const { error: errorNotify } = useNotification();
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [loadingStripe, setLoadingStripe] = useState(false);

  const [{ client_secret: clientSecret, customer_id: customerId }, setStripeSetupObject] = useState<
    SetupIntentResponse['data']
  >({
    id: '',
    client_secret: '',
    customer_id: '',
  });

  useEffect(() => {
    async function initializeStripe() {
      try {
        setLoadingStripe(true);
        if (session) {
          const [stripeSetup, stripeObject] = await Promise.all([
            generateSetupIntent(virtualLabId, session.accessToken),
            getStripe(),
          ]);
          setStripePromise(stripeObject);
          setStripeSetupObject(stripeSetup.data);
          setLoadingStripe(false);
        }
      } catch (error) {
        errorNotify(
          "We're having some trouble setting up your payment options at the moment. Please try again in a little while.",
          undefined,
          'topRight',
          true,
          virtualLabId
        );
        setLoadingStripe(false);
        toggleOpenStripeForm();
      }
    }

    if (virtualLabId && !stripeRef.current) {
      initializeStripe();
      stripeRef.current = true;
    }
  }, [errorNotify, session, toggleOpenStripeForm, virtualLabId]);

  if (loadingStripe)
    return (
      <div className="flex items-center justify-center py-7">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );

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
      <Form {...{ customerId, virtualLabId, toggleOpenStripeForm }} />
    </Elements>
  );
}
