import { FormEvent, useReducer } from 'react';

type SearchState = { focused: boolean; query: string };
type SearchAction<T> = {
  type: T;
  payload?: string;
};

function searchReducer(
  state: SearchState,
  action: SearchAction<'focus-toggle' | 'text-update'>
): SearchState {
  const { type, payload } = action;
  const { focused } = state;

  switch (type) {
    case 'focus-toggle': {
      return { ...state, focused: !focused };
    }
    case 'text-update': {
      return { ...state, query: payload ?? '' };
    }
    default:
      return state;
  }
}

export default function useSearchBtn(defaultQuery: string = '') {
  const [state, dispatch] = useReducer(searchReducer, {
    focused: false,
    query: defaultQuery,
  });

  const onClick = () => dispatch({ type: 'focus-toggle' });

  const onInput = (event: FormEvent<HTMLInputElement>) =>
    dispatch({
      type: 'text-update',
      payload: (event.target as HTMLInputElement).value,
    });

  const onBlur = () => dispatch({ type: 'focus-toggle' });

  return {
    focused: state.focused,
    onBlur,
    onClick,
    onInput,
    value: state.query,
  };
}
