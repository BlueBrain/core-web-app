import { ReactNode } from 'react';

export enum PrimaryDropdownAnnotation {
  modified,
  needAction,
  built,
}

export interface MenuItem {
  id?: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  baseHref?: string;
  onClick?: () => void;
  annotation?: PrimaryDropdownAnnotation;
  isActive?: boolean;
}
