'use client';

import Drawer from 'antd/lib/drawer';
import { useAtomValue } from 'jotai';

import { useLiteratureAtom, literatureAtom } from '../state';

export default function FilterPanel() {
  const { isFilterPanelOpen } = useAtomValue(literatureAtom);
  const update = useLiteratureAtom();
  const onClose = () => update('isFilterPanelOpen', false);

  return (
    <Drawer
      mask
      destroyOnClose
      maskClosable
      open={isFilterPanelOpen}
      onClose={onClose}
      closeIcon={false}
    />
  );
}
