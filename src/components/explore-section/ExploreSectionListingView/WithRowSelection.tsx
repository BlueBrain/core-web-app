import { Key, ReactNode } from 'react';
import { useAtom } from 'jotai';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/DownloadButton';
import { ESResponseRaw } from '@/types/explore-section/resources';

type RowSelection = {
  selectedRowKeys: Key[];
  onChange: (_keys: Key[], rows: ESResponseRaw[]) => void;
  type: 'checkbox' | 'radio';
};

export default function WithRowSelection({
  children,
  experimentTypeName,
  renderButton,
}: {
  children: (rowSelection: RowSelection) => ReactNode;
  experimentTypeName: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom(experimentTypeName));
  const clearSelectedRows = () => setSelectedRows([]);

  return (
    <>
      {children({
        selectedRowKeys: selectedRows.map(({ _source }) => _source._self),
        onChange: (_keys: Key[], rows: ESResponseRaw[]) => setSelectedRows(() => rows),
        type: 'checkbox',
      })}
      {!!(renderButton && selectedRows.length) && renderButton({ selectedRows, clearSelectedRows })}
    </>
  );
}
