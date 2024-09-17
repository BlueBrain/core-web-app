'use client';

import { useMemo, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { brainRegionsWithRepresentationAtom } from '@/state/brain-regions';
import { meModelDetailsAtom } from '@/state/virtual-lab/build/me-model-setter';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';
import { selectedEModelIdAtom, selectedMModelIdAtom } from '@/state/virtual-lab/build/me-model';

type Params = {
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

export default function NewMEModelPage({ params: { projectId, virtualLabId } }: Params) {
  const setMEModelDetails = useSetAtom(meModelDetailsAtom);
  const setSelectedMModel = useSetAtom(selectedMModelIdAtom);
  const setSelectedEModel = useSetAtom(selectedEModelIdAtom);
  const contributors = useAtomValue(virtualLabProjectUsersAtomFamily({ projectId, virtualLabId }));
  const [isFormValid, setIsFormValid] = useState(false);
  const brainRegions = useAtomValue(brainRegionsWithRepresentationAtom);
  const [form] = Form.useForm();
  const router = useRouter();

  const onValuesChange = () => {
    form
      .validateFields()
      .then(() => {
        setIsFormValid(true);
      })
      .catch((error) => {
        if (error.errorFields.length > 0) {
          setIsFormValid(false);
        } else {
          setIsFormValid(true);
        }
      });
  };

  const onSubmit = () => {
    const values = form.getFieldsValue();
    const brainRegion = brainRegions?.find((br) => br.id === values.brainRegion);

    if (values.brainRegion && !brainRegion) return;

    setMEModelDetails({
      name: values.name,
      description: values.description,
      brainRegion: brainRegion && { id: brainRegion.id, title: brainRegion.title },
    });
    setSelectedMModel(null);
    setSelectedEModel(null);
    router.push('new/configure');
  };

  const brainRegionOptions = useMemo(
    () => brainRegions?.map((brainRegion) => ({ label: brainRegion.title, value: brainRegion.id })),
    [brainRegions]
  );

  return (
    <div className="m-10 flex h-full flex-col gap-5">
      <div className="text-3xl font-bold text-primary-8">Build a new single neuron model</div>
      <div className="flex flex-row gap-4">
        <div className="flex-1 grow flex-col gap-4">
          <Form
            className="flex flex-col gap-4"
            form={form}
            layout="vertical"
            autoComplete="off"
            preserve={false}
            onValuesChange={onValuesChange}
          >
            <Form.Item
              hasFeedback
              label={<span className="text-primary-8">NAME</span>}
              name="name"
              validateTrigger="onBlur"
              rules={[{ required: true, message: 'Please fill the name' }]}
            >
              <Input placeholder="Your model name..." />
            </Form.Item>
            <Form.Item
              hasFeedback
              label={<span className="text-primary-8">DESCRIPTION</span>}
              name="description"
            >
              <Input.TextArea placeholder="Your description..." showCount />
            </Form.Item>
            <Form.Item
              hasFeedback
              label={<span className="text-primary-8">BRAIN REGION</span>}
              name="brainRegion"
            >
              <Select
                placeholder="Select brain region"
                optionFilterProp="label"
                allowClear
                showSearch
                options={brainRegionOptions}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="mr-10 flex-1 text-primary-7">
          <div className="uppercase text-neutral-4">Contributors</div>
          <div className="mt-2">
            <ul>{contributors?.map(({ id, name }) => <li key={id}>{name}</li>)}</ul>
          </div>
        </div>
        <div className="mr-10 flex-1  text-primary-7">
          <div className="uppercase text-neutral-4">Creation Date</div>
          <div className="mt-2">{new Intl.DateTimeFormat('fr-CH').format(new Date())}</div>
        </div>
      </div>
      <div>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isFormValid}
          size="large"
          onClick={onSubmit}
          className=" absolute bottom-0 right-0 m-10 rounded-none bg-primary-8"
        >
          Start building
        </Button>
      </div>
    </div>
  );
}
