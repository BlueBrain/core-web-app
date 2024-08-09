import { PaymentElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  FormEvent,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { Button, Spin } from 'antd';
import { Stripe, StripeElementsOptions } from '@stripe/stripe-js';

import { useAtomValue, useSetAtom } from 'jotai';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import z from 'zod';

import getStripe from './utils';
import StripeInput from './StripeInput';
import {
  ADDING_NEW_PAYMENT_METHOD_FAILED,
  ADDING_NEW_PAYMENT_METHOD_SUCCEEDED,
  PREPARING_STRIPE_FORM,
} from './messages';
import useNotification from '@/hooks/notifications';
import { getZodErrorPath, isStringEmpty } from '@/util/utils';
import {
  SetupIntentResponse,
  addNewPaymentMethodToVirtualLab,
  generateSetupIntent,
} from '@/services/virtual-lab/billing';
import sessionAtom from '@/state/session';
import {
  transactionFormStateAtom,
  virtualLabPaymentMethodsAtomFamily,
} from '@/state/virtual-lab/lab';
import { useAccessToken } from '@/hooks/useAccessToken';

type PaymentFormProps = {
  virtualLabId: string;
  toggleOpenStripeForm: Dispatch<SetStateAction<boolean>>;
};

const CardholderValidation = z.object({
  name: z.string(),
  email: z.string().email(),
});

type Cardholder = z.infer<typeof CardholderValidation>;
type CardholderKeys = keyof Cardholder;

const buildStripeFormOptions = (clientSecret: string): StripeElementsOptions => ({
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
});

function Form({ virtualLabId, toggleOpenStripeForm }: PaymentFormProps) {
  const accessToken = useAccessToken();
  const elements = useElements();
  const stripe = useStripe();
  const { error: errorNotify, success: successNotify } = useNotification();
  const refreshPaymentMethods = useSetAtom(virtualLabPaymentMethodsAtomFamily(virtualLabId));
  const setTransactionFormState = useSetAtom(transactionFormStateAtom);
  const [stripeElementsReady, setStipeElementsReady] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [cardholderForm, setCardHolderForm] = useState<Cardholder>({
    name: '',
    email: '',
  });
  const [cardholderFormErrorKeys, setCardholderFormErrorKeys] = useState<Array<CardholderKeys>>([]);

  const formLoaded = stripe && elements;
  const disableForm = !formLoaded || formLoading;

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

  const onStripeElementsReady = () => setStipeElementsReady(true);

  const onPaymentMethodSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
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
        const {
          data: { payment_method: PaymentMethod },
        } = await addNewPaymentMethodToVirtualLab(virtualLabId, accessToken, {
          name,
          email,
          setupIntentId: setupIntent.id,
        });
        successNotify(
          ADDING_NEW_PAYMENT_METHOD_SUCCEEDED,
          undefined,
          'topRight',
          true,
          virtualLabId
        );
        setTransactionFormState((prev) => ({ ...prev, selectedPaymentMethodId: PaymentMethod.id }));
        toggleOpenStripeForm(false);
        refreshPaymentMethods();
      }
    } catch (error) {
      errorNotify(ADDING_NEW_PAYMENT_METHOD_FAILED, undefined, 'topRight', true, virtualLabId);
    } finally {
      setFormLoading(false);
      setCardHolderForm({ name: '', email: '' });
      setCardholderFormErrorKeys([]);
      elements.getElement('payment')?.clear();
    }
  };

  return (
    <div className="relative my-4 flex w-full flex-col">
      <Button
        type="text"
        htmlType="button"
        className="mt-3 self-end"
        icon={<CloseOutlined className="text-base font-thin" />}
        onClick={() => toggleOpenStripeForm(false)}
      />
      <form
        name="stripe-payment-method-form"
        className="mx-auto w-full max-w-2xl"
        onSubmit={onPaymentMethodSubmit}
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
          <Button
            size="large"
            htmlType="submit"
            className="my-4 w-full rounded-none border-primary-8 bg-primary-8 text-center text-xl text-white"
            disabled={disableForm}
            loading={formLoading}
          >
            Save card
          </Button>
        )}
      </form>
    </div>
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
        errorNotify(PREPARING_STRIPE_FORM, undefined, 'topRight', true, virtualLabId);
        setLoadingStripe(false);
        toggleOpenStripeForm(false);
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
    <Elements stripe={stripePromise} options={buildStripeFormOptions(clientSecret)}>
      <Form
        {...{
          customerId,
          virtualLabId,
          toggleOpenStripeForm,
        }}
      />
    </Elements>
  );
}
