import { Modal } from 'antd';
import Entrypoint from '@/components/Entrypoint';

export default function RootPage({
  searchParams,
}: {
  searchParams: { errorcode: string | undefined };
}) {
  return (
    <div>
      <Entrypoint inviteErrorCode={searchParams.errorcode} />
      {searchParams.errorcode ? <Modal>2</Modal> : null}
    </div>
  );
}
