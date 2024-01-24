import { Fragment } from 'react';

type Props = {
  id: string;
  condition?: boolean | null;
  children: React.ReactNode;
};

/**
 * A conditional rendering component that only renders its children if the condition is true.
 * @component
 * @param {Object} props The props object
 * @param {string} props.id A unique identifier for the component use for seperation/debuging
 * @param {boolean} props.condition The condition to evaluate
 * @param {React.ReactNode} props.children The children to render if the condition is true
 * @returns {React.ReactNode|null} The rendered children or null
 */

export default function If({ id, condition, children }: Props) {
  if (!children || !condition) {
    return null;
  }
  return <Fragment key={id}>{children}</Fragment>;
}
