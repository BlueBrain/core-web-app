import { useEffect, useState, ReactNode } from 'react';
import Drawer from 'antd/lib/drawer';
import { CloseOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import ReloadIcon from '@/components/icons/Reload';

export type Props = {
  children?: ReactNode;
  toggleDisplay: () => void;
  display: boolean;
};

export default function GeneralizeDrawer ({ children, toggleDisplay, display }: Props) {
  return (
    <Drawer
      open={display}
      onClose={toggleDisplay}
      mask={false}
      destroyOnClose
      maskClosable
      closeIcon={
        <CloseOutlined className='bg-primary-9 text-xs absolute left-[-30px] top-[0px] w-[40px] h-[30px] pl-3 rounded-tl-[22px] rounded-bl-[22px] text-white cursor-pointer' />
      }
      width='20vw'
      headerStyle={{
        background: '#002766',
      }}
      bodyStyle={{
        display: 'flex',
        justifyContent: 'space-between',
        background: '#002766',
      }}
    >
      <div className='w-1/2 flex justify-between'>
        <h1 className='text-white'>CONTENT 1</h1>
      </div>

      <div className='w-1/2 flex justify-between'>
        <h1 className='text-white'>CONTENT 2</h1>
      </div>

    </Drawer>
  );
}
