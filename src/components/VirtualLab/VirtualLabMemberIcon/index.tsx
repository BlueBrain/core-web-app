import { Role } from '@/types/virtual-lab/members';

type Props = {
  role: Role;
  first_name: string;
  last_name: string;
};

export default function VirtualLabMemberIcon({ role, first_name, last_name }: Props) {
  const getInitials = () => {
    return `${first_name[0]} ${last_name[0]}`;
  };

  const generateRandomHexColor = () => {
    // Generating random RGB values
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Converting RGB to hexadecimal
    const hexRed = red.toString(16).padStart(2, '0');
    const hexGreen = green.toString(16).padStart(2, '0');
    const hexBlue = blue.toString(16).padStart(2, '0');

    // Concatenating hexadecimal values
    return `#${hexRed}${hexGreen}${hexBlue}`;
  };

  return (
    <div
      style={{ backgroundColor: generateRandomHexColor() }}
      className={`flex h-12 w-12 items-center justify-center ${role === 'member' ? 'rounded-full' : ''}`}
    >
      <span className="text-2xl font-bold text-white">{getInitials()}</span>
    </div>
  );
}
