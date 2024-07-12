import { Key } from 'react';
import { useAtom } from 'jotai';
import { RowSelectionType, TableRowSelection } from 'antd/es/table/interface';

import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreESHit } from '@/types/explore-section/es';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { DataType } from '@/constants/explore-section/list-views';

type RowSelection = Pick<
  TableRowSelection<ExploreESHit<ExploreSectionResource>>,
  'selectedRowKeys' | 'onChange' | 'type'
>;

export type RenderButtonProps = {
  selectedRows: ExploreESHit<ExploreSectionResource>[];
  clearSelectedRows: () => void;
};

export default function useRowSelection({
  dataType,
  selectionType = 'checkbox',
}: {
  dataType: DataType;
  selectionType?: RowSelectionType;
}): {
  rowSelection: RowSelection;
  selectedRows: ExploreESHit<ExploreSectionResource>[];
  clearSelectedRows: () => void;
} {
  const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom({ dataType }));
  const clearSelectedRows = () => setSelectedRows([]);

  return {
    rowSelection: {
      selectedRowKeys: selectedRows.map(
        ({ _source }: ExploreESHit<ExploreSectionResource>) => _source._self
      ),
      onChange: (_keys: Key[], rows: ExploreESHit<ExploreSectionResource>[]) =>
        setSelectedRows(() => rows),
      type: selectionType,
    },
    selectedRows,
    clearSelectedRows,
  };
}
