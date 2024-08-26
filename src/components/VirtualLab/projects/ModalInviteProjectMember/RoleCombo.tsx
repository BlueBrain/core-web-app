import { DownOutlined } from '@ant-design/icons';

export function RoleCombo({
  role,
  onChange,
}: {
  role: 'member' | 'admin';
  onChange: (role: 'member' | 'admin') => void;
}) {
  return (
    <button
      className="mr-8 flex items-center gap-4"
      type="button"
      onClick={() => onChange(role === 'admin' ? 'member' : 'admin')}
      aria-label="Role"
    >
      <div>{`${role.charAt(0).toUpperCase()}${role.substring(1)}`}</div>
      <DownOutlined />
    </button>
  );
}
