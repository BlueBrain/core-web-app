import Drawer from 'antd/lib/drawer';
import { CloseOutlined } from '@ant-design/icons';

export type Props = {
  toggleDisplay: () => void;
  display: boolean;
};

export default function GeneralizeDrawer ({ toggleDisplay, display }: Props) {
  return (
    <Drawer
      open={display}
      onClose={toggleDisplay}
      mask={false}
      destroyOnClose
      maskClosable
      closeIcon={
        <CloseOutlined className='bg-primary-7 text-xs absolute left-[-30px] top-[0px] w-[40px] h-[30px] pl-3 rounded-tl-[22px] rounded-bl-[22px] text-white cursor-pointer' />
      }
      headerStyle={{ background: '#0050B3', border: 'none' }}
      width='35vw'
      bodyStyle={{
        display: 'flex',
        padding: 0,
        margin: 0,
        backgroundColor: '#0050B3',
      }}
      title={null}
    >
      <div className='w-1/2 p-0 m-0'>
        {/* Content for the left section */}
        {/* You can add your own content here */}
      </div>

      <div className='w-1/2 p-0 m-0'>
        {/* Content for the left section */}
        {/* You can add your own content here */}
        <Drawer
          open={display}
          onClose={toggleDisplay}
          mask={false}
          destroyOnClose
          maskClosable
          closeIcon={null}
          headerStyle={{ background: 'bg-primary-9' }}
          width='20vw'
          bodyStyle={{
            display: 'flex',
            backgroundColor: '#002766',
          }}
          title={null}
        >
          <div className='w-full'>
            {/* Content for the left section */}
            {/* You can add your own content here */}
          </div>
        </Drawer>
      </div>
    </Drawer>
  );
}
