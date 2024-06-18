import { ChangeEventHandler, useCallback, useState } from 'react';
import { Upload, Image, UploadProps, Button, Select, Checkbox, CheckboxProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/navigation';
import delay from 'lodash/delay';

import {
  INSERT_INLINE_IMAGE_COMMAND,
  Position,
  UploadImage,
  UploaderGenerator,
  UploaderGeneratorResponse,
  getImageDimensions,
  getRcFileImageUrl,
} from '../utils';
import { classNames } from '@/util/utils';
import { Distribution } from '@/types/nexus';

type Props = {
  onUpload: UploaderGenerator;
  onClose: () => void;
};

type ActionsProps = {
  uploading: boolean;
  onClose: () => void;
  onTriggerUpload: () => void;
};

function Actions({ uploading, onClose, onTriggerUpload }: ActionsProps) {
  return (
    <div className="mt-8 flex items-center justify-end gap-2">
      <Button
        size="large"
        type="text"
        htmlType="button"
        className="rounded-none bg-transparent px-6 text-lg"
        disabled={uploading}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        size="large"
        type="primary"
        htmlType="button"
        className="rounded-none bg-primary-8 px-6 text-lg"
        onClick={onTriggerUpload}
        disabled={uploading}
        loading={uploading}
      >
        Confirm
      </Button>
    </div>
  );
}

export default function InsertImageDialog({ onClose, onUpload }: Props) {
  const router = useRouter();
  const [editor] = useLexicalComposerContext();
  const [alt, setAlt] = useState('');
  const [name, setName] = useState('');
  const [inline, setInline] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>(undefined);
  const [image, setImage] = useState<UploadImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadtatus] = useState<UploaderGeneratorResponse>(null);

  const onAltChange: ChangeEventHandler<HTMLInputElement> = (e) => setAlt(e.target.value);
  const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value);
  const onPositionChange = (value: Position) => setPosition(value);
  const onInlineChange: CheckboxProps['onChange'] = (e) => setInline(e.target.checked);

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const preview = await getRcFileImageUrl(file);
    setImage({ id: crypto.randomUUID(), file, preview, alt });
    return false;
  };

  const uploadCallback = useCallback(
    async (distributions: Array<Distribution>, files: Array<UploadImage>) => {
      const distribution = distributions[0];
      const file = files[0];
      const dimensions = await getImageDimensions(distribution.contentUrl);

      editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, {
        alt: distribution.name,
        src: distribution.contentUrl,
        position: file.position ?? 'full',
        width: dimensions.width,
        height: dimensions.height,
      });
    },
    [editor]
  );

  const onTriggerUpload = async () => {
    setUploading(true);
    if (image) {
      for await (const value of onUpload(
        [
          {
            ...image,
            name,
            alt,
            position,
          },
        ],
        uploadCallback
      )) {
        if (value?.status === 'success') {
          setUploadtatus(value);
          setUploading(false);
          router.refresh();
          delay(onClose, 100);
        }
      }
    }
  };

  return (
    <div className="w-full">
      <Upload
        withCredentials
        beforeUpload={beforeUpload}
        name="single-image"
        listType="picture"
        className={classNames(
          'w-full',
          '[&_.ant-upload-select]:w-full',
          '[&_.ant-upload-select]:!rounded-md [&_.ant-upload-select]:border-2 [&_.ant-upload-select]:border-dashed [&_.ant-upload-select]:border-gray-300',
          uploadStatus &&
            uploadStatus.source === 'image' &&
            (uploadStatus.status === 'success'
              ? '[&_.ant-upload-select]:!border-solid [&_.ant-upload-select]:!border-teal-600'
              : '[&_.ant-upload-select]:!border-solid [&_.ant-upload-select]:!border-rose-600')
        )}
        showUploadList={false}
        accept="image/*"
      >
        <div className="flex h-36 w-full items-center justify-center [&_.ant-image]:!h-28">
          {image?.preview ? (
            <Image
              src={image.preview}
              alt={alt}
              preview={false}
              className="!h-[inherit] object-cover"
            />
          ) : (
            <button className="w-full" type="button">
              <PlusOutlined />
              <div className="mt-2">Upload</div>
            </button>
          )}
        </div>
      </Upload>
      <div className="my-3 flex w-full flex-col gap-2">
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <span className="min-w-max font-bold text-primary-8">Name</span>
          <input
            name="name"
            value={name}
            onChange={onNameChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-3">
          <span className="min-w-max font-bold text-primary-8">Description</span>
          <input
            name="alt"
            value={alt}
            onChange={onAltChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
          />
        </div>
        <div className="grid h-11 grid-cols-[100px_40px_1fr] items-center gap-3">
          <span className="min-w-max font-bold text-primary-8">Inline Position</span>
          <Checkbox onChange={onInlineChange} />
          {inline && (
            <Select
              size="large"
              defaultValue={undefined}
              value={position}
              onChange={onPositionChange}
              className="max-w-48 [&_.ant-select-selector]:rounded-md"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
                { value: 'full', label: 'Full' },
              ]}
            />
          )}
        </div>
      </div>
      <Actions
        {...{
          uploading,
          onTriggerUpload,
          onClose,
        }}
      />
    </div>
  );
}
