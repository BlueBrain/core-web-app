import { fireEvent, screen } from '@testing-library/react';

export const getButton = (buttonLabel: string): HTMLButtonElement => {
  // Note: Not using screen.getByRole('button', {name: buttonLabel}) here because of its heavy performance penalty.
  const buttonElement = screen.getByText(new RegExp(buttonLabel, 'i')).closest('button');
  expect(buttonElement).toBeInTheDocument();
  return buttonElement!;
};

export const findButton = async (buttonLabel: string): Promise<HTMLButtonElement> => {
  // Note: Not using screen.findByRole('button', {name: buttonLabel}) here because of its heavy performance penalty.
  const buttonText = await screen.findByText(new RegExp(buttonLabel, 'i'));
  const buttonElement = buttonText.closest('button');
  expect(buttonElement).toBeInTheDocument();
  return buttonElement!;
};

export const queryButton = (buttonLabel: string): HTMLButtonElement | null | undefined => {
  // Note: Not using screen.queryByRole('button', {name: buttonLabel}) here because of its heavy performance penalty.
  return screen.queryByText(new RegExp(buttonLabel, 'i'))?.closest('button');
};

export const changeInputValue = (label: string, value: string) => {
  const inputElement = screen.getByLabelText(label) as HTMLInputElement;
  fireEvent.change(inputElement, { target: { value } });
};
