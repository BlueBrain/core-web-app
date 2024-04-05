import { InviteErrorCodes } from '@/types/virtual-lab/invites';

const getInviteErrorMessage = (code?: string): string => {
  try {
    const errorCode = Number(code);
    switch (errorCode) {
      case InviteErrorCodes.UNAUTHORIZED:
        return 'Please make sure you are signed in';
      case InviteErrorCodes.TOKEN_EXPIRED:
        return 'The invite link has expired';
      case InviteErrorCodes.INVALID_LINK:
        return 'Invite link is invalid';
      case InviteErrorCodes.INVITE_ALREADY_ACCEPTED:
        return 'This invite is already accepted.';
      case InviteErrorCodes.UNKNOWN:
      default:
        return 'An unknown error occured';
    }
  } catch {
    return 'An unknown error occured';
  }
};

export default function InvitePage({
  searchParams,
}: {
  searchParams: { errorcode: string | undefined };
}) {
  return (
    <div className="relative flex h-screen w-screen flex-col gap-4 bg-primary-8 p-8">
      <div className="m-auto items-center border border-white p-10 text-white">
        {getInviteErrorMessage(searchParams.errorcode)}
      </div>
    </div>
  );
}
