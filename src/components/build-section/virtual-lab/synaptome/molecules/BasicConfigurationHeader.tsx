import { Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { label } from './Label';
import { useSessionAtomValue } from '@/hooks/hooks';
import { selectorFnDate } from '@/util/explore-section/listing-selectors';
import { SynaptomeModelConfiguration } from '@/types/synaptome';
import { DisplayMessages } from '@/constants/display-messages';

export default function BasicConfigurationHeader() {
  const session = useSessionAtomValue();
  const { getFieldValue } = Form.useFormInstance<SynaptomeModelConfiguration>();
  const name: string = getFieldValue('name');
  const description: string = getFieldValue('description')?.trim() ?? '';

  return (
    <div className="w-full gap-5 border-b border-neutral-2">
      <div className="flex w-full flex-col gap-4 px-10 pb-10 pt-4">
        <div className="grid grid-cols-2 gap-14">
          <div className="">
            {label('name')}
            <div className="text-2xl font-bold text-primary-8">{name}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-14">
          <div className="">
            {label('description')}
            <div className="text-justify font-normal text-primary-8">
              {description.length > 0 ? description : DisplayMessages.NO_DATA_STRING}
            </div>
          </div>
          <div className="grid grid-cols-2 items-start justify-between gap-2">
            <div className="flex flex-col items-start gap-1">
              {label('contributors', 'secondary')}
              <div className="flex items-center justify-center gap-2 text-primary-8">
                <UserOutlined className="h-3 w-3" />
                {session?.user.name}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {label('creation date', 'secondary')}
              <div className="text-primary-8">{selectorFnDate(new Date().toISOString())}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
