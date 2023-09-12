import { Key, ReactNode, useMemo } from 'react';
import { useAtom } from 'jotai';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreESHit } from '@/types/explore-section/es';

type RowSelection = {
  selectedRowKeys: Key[];
  onChange: (_keys: Key[], rows: ExploreESHit[]) => void;
  type: 'checkbox' | 'radio';
};

export type RenderButtonProps = {
  selectedRows: ExploreESHit[];
  clearSelectedRows: () => void;
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
  const [selectedRows, setSelectedRows] = useAtom(
    useMemo(() => selectedRowsAtom({ experimentTypeName }), [experimentTypeName])
  );
  const clearSelectedRows = () => setSelectedRows([]);

  return (
    <>
      {children({
        selectedRowKeys: selectedRows.map(({ _source }: ExploreESHit) => _source._self),
        onChange: (_keys: Key[], rows: ExploreESHit[]) => setSelectedRows(() => rows),
        type: 'checkbox',
      })}
      {!!(renderButton && selectedRows.length) && renderButton({ selectedRows, clearSelectedRows })}
    </>
  );
}
