import { ChangeEventHandler, useCallback, useState } from 'react';
import { Upload, UploadProps, Select, Checkbox, CheckboxProps, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/navigation';
import delay from 'lodash/delay';

import { INSERT_VIDEO_COMMAND } from './utils';
import { classNames } from '@/util/utils';
import { Distribution } from '@/types/nexus';
import {
  Position,
  UploadFileMetadata,
  UploaderGenerator,
  UploaderGeneratorResponse,
} from '@/components/papers/uploader/types';
import { generateVideoThumbnail } from '@/components/papers/uploader/utils';
import { Actions } from '@/components/papers/uploader/Actions';

type Props = {
  onUpload: UploaderGenerator;
  onClose: () => void;
};

export default function InsertVideoDialog({ onClose, onUpload }: Props) {
  const router = useRouter();
  const [editor] = useLexicalComposerContext();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [inline, setInline] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>(undefined);
  const [video, setVideo] = useState<UploadFileMetadata | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadtatus] = useState<UploaderGeneratorResponse>(null);

  const onDescriptionChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setDescription(e.target.value);
  const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value);
  const onPositionChange = (value: Position) => setPosition(value);
  const onInlineChange: CheckboxProps['onChange'] = (e) => setInline(e.target.checked);

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    setUploadtatus(null);
    const id = crypto.randomUUID();
    try {
      const { url } = await generateVideoThumbnail(file);
      setVideo({
        file,
        id,
        alt: description,
        preview: url,
      });
    } catch (error) {
      setUploadtatus({ source: 'binary', status: 'failed', id });
    }
    return false;
  };

  const uploadCallback = useCallback(
    async (distributions: Array<Distribution>, files: Array<UploadFileMetadata>) => {
      const distribution = distributions[0];
      const file = files[0];

      editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
        title: distribution.name,
        src: distribution.contentUrl,
        description: file.alt,
        position: file.position ?? 'full',
      });
    },
    [editor]
  );

  const onTriggerUpload = async () => {
    setUploading(true);
    if (video) {
      for await (const value of onUpload(
        [
          {
            ...video,
            name,
            position,
            alt: description,
          },
        ],
        uploadCallback
      )) {
        if (value?.status === 'success') {
          setUploadtatus(value);
          router.refresh();
          delay(onClose, 1000);
          setUploading(false);
        }
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-4 text-2xl font-bold text-primary-9">Insert Video</h1>
      <Upload
        withCredentials
        beforeUpload={beforeUpload}
        name="single-video"
        listType="picture"
        className={classNames(
          'w-full',
          '[&_.ant-upload-select]:w-full',
          '[&_.ant-upload-select]:!rounded-md [&_.ant-upload-select]:border-2 [&_.ant-upload-select]:border-dashed [&_.ant-upload-select]:border-gray-300',
          uploadStatus &&
            uploadStatus.source === 'binary' &&
            (uploadStatus.status === 'success'
              ? '[&_.ant-upload-select]:!border-solid [&_.ant-upload-select]:!border-teal-600'
              : '[&_.ant-upload-select]:!border-solid [&_.ant-upload-select]:!border-rose-600')
        )}
        showUploadList={false}
        accept="video/*"
      >
        <div className="relative flex h-36 w-full items-center justify-center">
          {video?.preview && (
            <Image
              key={video.id}
              src={video.preview}
              preview={false}
              rootClassName="w-full h-full  absolute inset-0"
              className="-z-10 !h-full w-full rounded-md object-cover object-center opacity-30"
              alt="gallery thumbnail"
            />
          )}
          <button className="z-10 w-full" type="button">
            <PlusOutlined />
            <div className="mt-2">Click or drag video to this area to upload</div>
          </button>
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
            value={description}
            onChange={onDescriptionChange}
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
