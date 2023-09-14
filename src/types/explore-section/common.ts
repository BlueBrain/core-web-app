export type Id = {
  '@id': string;
};

export type Label = {
  label: string;
};

export type Type<T = string> = {
  '@type': T;
};

export type IdWithLabel = Id & Label;

export type IdWithType<T = string> = Id & Type<T>;

export type IdLabelWithType<T = string> = IdWithLabel & Type<T>;

export type LabelWithType<T = string> = Label & Type<T>;
