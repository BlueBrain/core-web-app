import { Divider } from 'antd';
import startCase from 'lodash/startCase';
import omit from 'lodash/omit';
import { getGroupedCardFields } from '@/util/explore-section/cardViewUtils';
import { Field } from '@/components/explore-section/DetailHeader';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import { DataType } from '@/constants/explore-section/list-views';

export default function Morphometrics({
  dataType,
  resource,
}: {
  dataType: DataType;
  resource: DetailType;
}) {
  const groupedCardFields = getGroupedCardFields(dataType);

  // Filter out the 'Metadata' group
  const filteredGroupedCardFields = omit(groupedCardFields, 'Metadata');

  return (
    <div className="flex max-w-screen-2xl flex-col gap-10">
      <Divider className="w-full" />
      <h1 className="text-xl font-bold text-primary-8">Morphometrics</h1>
      <div className="grid grid-cols-5 gap-4 break-words">
        {Object.entries(filteredGroupedCardFields).map(([group, fields]) => (
          <div key={group}>
            <h2 className="mb-8 text-lg font-semibold text-primary-8">{startCase(group)}</h2>
            {fields.map((item) => (
              <Field key={item.field} field={item.field} data={resource} className="mb-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
