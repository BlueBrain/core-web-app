import { useEffect, useState } from 'react';
import Drawer from 'antd/lib/drawer';
import { CloseOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import ReloadIcon from '@/components/icons/Reload';

export default function GeneralizeDrawer() {
  return (
    <Drawer
      onClose={() => console.log("CLOSED")}
      mask={false}
      destroyOnClose
      maskClosable
      closeIcon={
        <CloseOutlined className="bg-primary-9 text-xs absolute left-[-30px] top-[0px] w-[40px] h-[30px] pl-3 rounded-tl-[22px] rounded-bl-[22px] text-white cursor-pointer" />
      }
      width="20vw"
      headerStyle={{
        background: '#002766',
      }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#002766',
      }}
    >
        <h1>CONTENT</h1>
      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={() => console.log("CLEAR")}
          className="flex justify-center items-center"
        >
          <span className="text-primary-2 mr-1">Clear</span>
          <ReloadIcon className="text-primary-2" />
        </button>

        <button
          type="submit"
          onClick={()=> console.log("SUBMIT")}
          className="mt-4 float-right bg-primary-2 py-3 px-8 text-primary-9"
        >
          Apply
        </button>
      </div>
    </Drawer>
  );
}