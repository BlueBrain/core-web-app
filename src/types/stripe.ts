export type StripeSetup = {
  intentId: string;
  clientSecret: string;
  customerId: string;
};

export type StripeCustomer = {
  id: string;
  name: string;
  email: string;
};
