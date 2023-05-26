import { ReactElement } from 'react';

type CenteredMessageProps = {
  message: string;
  icon?: ReactElement;
};

export default function CenteredMessage({ message, icon }: CenteredMessageProps) {
  return (
    <div className="flex items-center justify-center h-80">
      <div className="text-center">
        {icon && icon}
        <div className="mt-4">{message}</div>
      </div>
    </div>
  );
}
