import { Modal } from 'antd';
import { useSetAtom } from 'jotai';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { eModelUIConfigAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { convertTraceForUI } from '@/services/e-model';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { ExploreESHit } from '@/types/explore-section/es';
import { ExperimentalTrace } from '@/types/explore-section/es-experiment';

const TYPE = 'https://bbp.epfl.ch/ontologies/core/bmo/ExperimentalTrace';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
};

const pickButtonStyle =
  'font-semibold mt-2 px-14 py-4 text-primary-8 bg-white sticky bottom-0 self-end border border-primary-8';

export default function PickTraces({ isOpen, onCancel, onOk }: Props) {
  const width = typeof window !== 'undefined' ? window.innerWidth - 50 : undefined;
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);

  const onTraceAdd = (selectedRows: ExploreESHit[]) => {
    setEModelUIConfig((oldAtomData) => {
      const savedTraces = oldAtomData?.traces?.length ? [...oldAtomData.traces] : [];
      const savedTraceIds = savedTraces.map((t) => t['@id']);
      const newRows = selectedRows.filter((row) => !savedTraceIds.includes(row._source['@id']));
      const selectedTraces = newRows.map((row) =>
        convertTraceForUI(row._source as ExperimentalTrace)
      );

      return {
        ...oldAtomData,
        traces: [...savedTraces, ...selectedTraces],
      };
    });
    onOk();
  };

  const pickTraceButtonFn = ({ selectedRows }: RenderButtonProps) => (
    <button type="button" className={pickButtonStyle} onClick={() => onTraceAdd(selectedRows)}>
      Add trace
    </button>
  );

  return (
    <div>
      <Modal
        open={isOpen}
        title={null}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        centered
        width={width}
      >
        <ExploreSectionListingView
          experimentTypeName={TYPE}
          enableDownload
          renderButton={pickTraceButtonFn}
          brainRegionSource="root"
        />
      </Modal>
    </div>
  );
}
