import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import CustomSelect from './CustomSelect';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import Style from './add-rule-modal.module.css';

export interface AddRuleModalProps {
  open: boolean;
  onValidate(rule: SynapticAssignmentRule): void;
  onCancel(): void;
}

const INITIAL_RULE: SynapticAssignmentRule = {
  fromEType: null,
  fromHemisphere: 'left',
  fromMType: null,
  fromRegion: null,
  fromSClass: null,
  synapticType: null,
  toEType: null,
  toHemisphere: 'left',
  toMType: null,
  toRegion: null,
  toSClass: null,
};

export default function AddRuleModal({ open, onValidate, onCancel }: AddRuleModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [rule, setRule] = useState<SynapticAssignmentRule>({ ...INITIAL_RULE });
  useEffect(() => {
    setRule({ ...INITIAL_RULE });
    setIsOpen(open);
  }, [open]);
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
        <div className="flex justify-between items-center w-full">
          <CustomSelect rule={rule} onChange={setRule} field="synapticType" />
          <div>
            <Button type="text" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleValidate}>
              Confirm
            </Button>
          </div>
        </div>
      }
    >
      <div className={Style.grid}>
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
