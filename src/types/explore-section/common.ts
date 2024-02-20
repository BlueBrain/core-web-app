import { DateISOString } from '@/types/nexus/common';

export type Id = {
  '@id': string;
};

export type Label = {
  label: string;
};

export type Name = {
  name: string;
};

export type Type<T = string> = {
  '@type': T;
};

type Value<V = number> = {
  '@value': V;
};

export type IdWithLabel = Id & Label;

export type IdWithName = Id & Name;

export type IdWithType<T = string> = Id & Type<T>;

export type IdWithValue = Id & Value;

export type IdLabelWithType<T = string> = IdWithLabel & Type<T>;

export type LabelWithType<T = string> = Label & Type<T>;

export type TypeWithDate = Type & Value<DateISOString>;

export enum SimulationStatus {
  running = 'Running',
  done = 'Done',
  failed = 'Failed',
}
