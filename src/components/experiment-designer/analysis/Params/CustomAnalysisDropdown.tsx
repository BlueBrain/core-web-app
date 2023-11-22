import { useEffect } from 'react';
import { Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PrimitiveAtom, useAtom } from 'jotai';

import { ExpDesignerCustomAnalysisDropdown } from '@/types/experiment-designer';
import Link from '@/components/Link';
import { useAnalyses } from '@/app/explore/(content)/simulation-campaigns/shared';
import { basePath } from '@/config';
import { subheaderStyle } from '@/components/experiment-designer/GenericParamWrapper';

export default function CustomAnalysisDropdown({
  paramAtom,
}: {
  paramAtom: PrimitiveAtom<ExpDesignerCustomAnalysisDropdown>;
}) {
  const [data, setData] = useAtom(paramAtom);
  const [analyses] = useAnalyses();

  useEffect(() => {
    if (analyses.length) {
      setData((oldAtomData) => ({
        ...oldAtomData,
        options: analyses.map((a) => ({ label: a.name, value: JSON.stringify(a) })),
        value: null,
      }));
    }
  }, [analyses, setData]);

  const onChange = (analysisInfoStringified: string) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: analysisInfoStringified,
    }));
  };

  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>

      <Select
        className="mt-3 pl-3"
        value={data.value || null}
        options={data.options}
        style={{ minWidth: '200px' }}
        onChange={onChange}
        size="small"
      />
      <div className="block mt-3 pl-3 text-primary-8">
        <Link className="flex items-center mb-8" href={`${basePath}/simulate/experiment-analysis`}>
          <PlusOutlined className="inline-block mr-3 border" />
          Add analysis
        </Link>
      </div>
    </>
  );
}
