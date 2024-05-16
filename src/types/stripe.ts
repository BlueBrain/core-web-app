export type StripeSetup = {
  id: string;
  clientSecret: string;
  customerId: string;
};

export type StripeCustomer = {
  id: string;
  name: string;
  email: string;
};
