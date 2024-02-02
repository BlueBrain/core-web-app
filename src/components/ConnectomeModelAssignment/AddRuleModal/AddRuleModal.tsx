import { useEffect, useState, useMemo } from 'react';
import { Button, Modal } from 'antd';
import { useAtom } from 'jotai';
import { loadingAtom } from '../state';
import { useFieldsOptionsProvider } from '../hooks';
import CustomSelect from './CustomSelect';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import styles from './add-rule-modal.module.css';

export interface AddRuleModalProps {
  open: boolean;
  onValidate(rule: SynapticAssignmentRule): void;
  onCancel(): void;
}

export default function AddRuleModal({ open, onValidate, onCancel }: AddRuleModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const options = useFieldsOptionsProvider();
  const initialRule = useMemo(
    () => ({
      fromEType: null,
      fromHemisphere: 'left',
      fromMType: null,
      fromRegion: null,
      fromSClass: null,
      synapticType: options('synapticType')[0],
      toEType: null,
      toHemisphere: 'left',
      toMType: null,
      toRegion: null,
      toSClass: null,
    }),
    [options]
  );
  const [rule, setRule] = useState<SynapticAssignmentRule>({ ...initialRule });
  const [loading] = useAtom(loadingAtom);

  useEffect(() => {
    setRule({ ...initialRule });
    setIsOpen(open);
  }, [open, initialRule]);
  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
  };
  const handleValidate = () => {
    setIsOpen(false);
    onValidate({ ...rule });
  };
  return (
    <Modal
      open={isOpen}
      width="900px"
      title="Add synapse assignment rule"
      footer={
        <div className="flex w-full items-center justify-between">
          <CustomSelect rule={rule} onChange={setRule} field="synapticType" />
          <div>
            <Button type="text" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleValidate} loading={loading}>
              Confirm
            </Button>
          </div>
        </div>
      }
    >
      <div className={styles.grid}>
        <h2>From</h2>
        <CustomSelect rule={rule} onChange={setRule} field="fromHemisphere" />
        <CustomSelect rule={rule} onChange={setRule} field="fromRegion" />
        <CustomSelect rule={rule} onChange={setRule} field="fromSClass" />
        <CustomSelect rule={rule} onChange={setRule} field="fromMType" />
        <CustomSelect rule={rule} onChange={setRule} field="fromEType" />
        <h2>To</h2>
        <CustomSelect rule={rule} onChange={setRule} field="toHemisphere" />
        <CustomSelect rule={rule} onChange={setRule} field="toRegion" />
        <CustomSelect rule={rule} onChange={setRule} field="toSClass" />
        <CustomSelect rule={rule} onChange={setRule} field="toMType" />
        <CustomSelect rule={rule} onChange={setRule} field="toEType" />
      </div>
    </Modal>
  );
}
