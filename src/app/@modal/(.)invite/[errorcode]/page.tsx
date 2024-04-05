import { Modal } from 'antd';

export default function PhotoModal({ params: { errorcode } }: { params: { errorcode: string } }) {
  console.log('Params');
  return <Modal>{errorcode}</Modal>;
}
