import { Key, ReactNode } from 'react';
import { useAtom } from 'jotai';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreESHit } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { DataType } from '@/constants/explore-section/list-views';

type RowSelection = {
  selectedRowKeys: Key[];
  onChange: (_keys: Key[], rows: ExploreESHit<ExploreSectionResource>[]) => void;
  type: 'checkbox' | 'radio';
};

export type RenderButtonProps = {
  selectedRows: ExploreESHit<ExploreSectionResource>[];
  clearSelectedRows: () => void;
};

export default function WithRowSelection({
  children,
  dataType,
  renderButton,
}: {
  children: (rowSelection: RowSelection) => ReactNode;
  dataType: DataType;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom({ dataType }));
  const clearSelectedRows = () => setSelectedRows([]);

  return (
    <>
      {children({
        selectedRowKeys: selectedRows.map(
          ({ _source }: ExploreESHit<ExploreSectionResource>) => _source._self
        ),
        onChange: (_keys: Key[], rows: ExploreESHit<ExploreSectionResource>[]) =>
          setSelectedRows(() => rows),
        type: 'checkbox',
      })}
      {!!(renderButton && selectedRows.length) && renderButton({ selectedRows, clearSelectedRows })}
    </>
  );
}
