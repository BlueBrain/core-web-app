'use client';

type Props = {
  message: string;
};

export default function VirtualLabSettingsError({ message }: Props) {
  return (
    <div className="ml-10 border border-primary-7 p-12">
      <h3>{message}</h3>
    </div>
  );
}
