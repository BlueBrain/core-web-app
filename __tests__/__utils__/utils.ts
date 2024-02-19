import { act, fireEvent, screen } from '@testing-library/react';
import { format } from 'date-fns';

export const getButton = (buttonLabel: string, exact: boolean = false): HTMLButtonElement => {
  // Note: Not using screen.getByRole('button', {name: buttonLabel}) here because of its heavy performance penalty.
  const buttonElement = screen
    .getByText(exact ? buttonLabel : new RegExp(buttonLabel, 'i'))
    .closest('button');
  expect(buttonElement).toBeInTheDocument();
  return buttonElement!;
};

export const findButton = async (
  buttonLabel: string,
  exact: boolean = false
): Promise<HTMLButtonElement> => {
  // Note: Not using screen.findByRole('button', {name: buttonLabel}) here because of its heavy performance penalty.
  const buttonText = await screen.findByText(exact ? buttonLabel : new RegExp(buttonLabel, 'i'));
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

const SERVER_DATE_FORMAT = 'yyyy-MM-dd';
const UI_DATE_FORMAT = 'dd-MM-yyyy';

export const selectTodayAsDate = (type: 'start' | 'end') => {
  const dateInput = screen.getByPlaceholderText(type === 'start' ? 'Start date' : 'End date');
  fireEvent.mouseDown(dateInput);
  fireEvent.click(dateInput);

  const today = format(new Date(), SERVER_DATE_FORMAT);

  const todayCell = document.querySelector(`td[title="${today}"]`)!;
  expect(todayCell).toBeInTheDocument();
  fireEvent.click(todayCell);

  const dateInputAfter = screen.getByPlaceholderText(type === 'start' ? 'Start date' : 'End date');

  expect(dateInputAfter).toHaveValue(format(new Date(today), UI_DATE_FORMAT));
  return today;
};

export const click = (element: HTMLElement) => {
  act(() => {
    fireEvent.click(element);
    fireEvent.focus(element);
    fireEvent.mouseDown(element);
  });
};
