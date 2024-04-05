// import { InviteErrorCodes } from './api/invite/route';
import Entrypoint from '@/components/Entrypoint';
import { Suspense } from 'react';
import { Modal } from 'antd';

// const getInviteErrorMessage = (errorCode: number): string => {
//   console.log('ERROR COde', errorCode);
//   switch (errorCode) {
//     case InviteErrorCodes.UNAUTHORIZED:
//       return 'Please sign in';
//     case InviteErrorCodes.INVALID_LINK:
//       return 'Invite link is invalid';
//     case InviteErrorCodes.INVITE_ALREADY_ACCEPTED:
//       return 'This invite is already accepted.';
//     case InviteErrorCodes.UNKNOWN:
//     default:
//       console.log('UNKNOWN');
//       return 'An unknown error occured';
//   }
// };

export default function RootPage({
  searchParams,
}: {
  searchParams: { errorcode: string | undefined };
}) {
  console.log('Search Code', searchParams.errorcode);
  return <Entrypoint errorMessage={searchParams.errorcode} />;
}
