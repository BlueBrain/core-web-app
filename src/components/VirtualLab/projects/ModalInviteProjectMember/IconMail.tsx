import { MailOutlined } from '@ant-design/icons';

export function IconMail({ disabled = false }: { disabled?: boolean }) {
  return (
    <div
      className={`back-black flex h-8 w-8 items-center justify-center ${disabled ? 'bg-transparentBlack text-black' : 'bg-dark text-white'}`}
    >
      <MailOutlined />
    </div>
  );
}
