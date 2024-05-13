export type PaymentMethod = {
  id: string;
  brand: string;
  card_number: string;
  cardholder_name: string;
  cardholder_email: string;
  expire_at: string;
  default: boolean;

  created_at: Date;
  updated_at: Date | null;
};
