import { PaymentIntent } from '@stripe/stripe-js';

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

export type VlabBalance = {
  virtual_lab_id: string;
  budget: number;
  total_spent: number;
};

export type VlabBudgetTopup = {
  virtual_lab_id: string;
  status: PaymentIntent['status'];
};
