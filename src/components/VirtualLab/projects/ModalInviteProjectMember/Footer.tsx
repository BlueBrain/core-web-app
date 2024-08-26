import { Button } from 'antd';
import { Member } from './types';

export interface FooterProps {
  members: Member[];
  onClose: () => void;
  onInvite: () => void;
  loading: boolean;
}

export function Footer({ members, onClose, onInvite, loading }: FooterProps) {
  return (
    <div className="flex flex-row justify-end gap-2">
      <Button type="text" className="min-w-36 text-primary-8" onClick={onClose}>
        Cancel
      </Button>
      <Button
        htmlType="submit"
        className="min-w-36 rounded-none border-primary-8 bg-primary-8 text-white"
        disabled={members.length === 0 || loading}
        onClick={onInvite}
      >
        {loading ? 'Inviting...' : 'Invite'}
      </Button>
    </div>
  );
}
