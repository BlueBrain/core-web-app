import { ChangeEventHandler, useCallback, useState } from 'react';
import { Upload, UploadProps } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, InboxOutlined } from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import delay from 'lodash/delay';
import map from 'lodash/map';
import reject from 'lodash/reject';

import {
  INSERT_GALLERY_COMMAND,
  UploadImage,
  UploaderGenerator,
  getRcFileImageUrl,
} from '../ImagePlugin/utils';
import { Actions } from '../ImagePlugin/InlineImage/Dialog';
import { classNames } from '@/util/utils';
import { Distribution } from '@/types/nexus';
import { Delete } from '@/components/icons/EditorIcons';

type Props = {
  onUpload: UploaderGenerator;
  onClose: () => void;
};

export default function InsertGalleryDialog({ onUpload, onClose }: Props) {
  const router = useRouter();
  const [editor] = useLexicalComposerContext();
  const [images, setImages] = useState<Array<UploadImage>>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [uploads, setUploads] = useState<{
    success: Array<string>;
    failed: Array<string>;
  }>({
    success: [],
    failed: [],
  });

  const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setDescription(e.target.value);
  const onTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => setTitle(e.target.value);

  const addToSuccess = useCallback(
    (id: string) =>
      setUploads((prev) => ({
        failed: prev.failed,
        success: [...prev.success, id],
      })),
    []
  );

  const addToFailed = useCallback(
    (id: string) =>
      setUploads((prev) => ({
        failed: [...prev.failed, id],
        success: prev.success,
      })),
    []
  );

  const uploadCallback = useCallback(
    (distributions: Array<Distribution>) => {
      editor.dispatchCommand(INSERT_GALLERY_COMMAND, {
        title,
        description,
        images: map(distributions, 'contentUrl'),
      });
    },
    [description, editor, title]
  );

  const onTriggerUpload = async () => {
    setUploading(true);
    for await (const value of onUpload(images, uploadCallback)) {
      if (value?.source === 'image') {
        if (value?.status === 'success') addToSuccess(value.id);
        if (value?.status === 'failed') addToFailed(value.id);
      }
    }
    router.refresh();
    delay(onClose, 1000);
    setUploading(false);
  };

  const beforeUpload: UploadProps['beforeUpload'] = async (_, files) => {
    const previews = [];
    for (const file of files) {
      const preview = await getRcFileImageUrl(file);
      previews.push({ id: crypto.randomUUID(), file, preview });
    }
    setImages([...images, ...previews]);
    // Return false to not start the automatic upload
    return false;
  };

  const onRemove = (file: UploadImage) => () => setImages(reject(images, ['id', file.id]));

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-primary-9">Insert Gallery</h1>
      <div className="my-3 flex w-full flex-col gap-2">
        <div className="flex flex-col items-start gap-3">
          <div className="min-w-max text-base font-bold text-primary-8">Name</div>
          <input
            name="name"
            value={title}
            onChange={onTitleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
          />
        </div>
        <div className="flex flex-col items-start gap-3">
          <div className="min-w-max text-base font-bold text-primary-8">Description</div>
          <textarea
            name="description"
            value={description}
            rows={3}
            onChange={onDescriptionChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
          />
        </div>
      </div>
      <div className="mb-3 min-w-max text-base font-bold text-primary-8">Images</div>
      <div className="flex w-full flex-wrap gap-3 rounded-md border border-gray-200 p-2">
        {Boolean(images.length) && (
          <div className="flex w-full flex-wrap gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                className={classNames(
                  'group relative flex h-40 w-48 flex-[20%] items-center gap-2 rounded-md border border-gray-200',
                  uploads.success.includes(image.id)
                    ? '!rounded-lg border-2 border-teal-600 opacity-100'
                    : 'opacity-70',
                  uploads.failed.includes(image.id) &&
                    '!rounded-lg border-2 border-rose-600 opacity-70'
                )}
              >
                <NextImage
                  fill
                  src={image.preview}
                  alt={image.file.name}
                  className="rounded-md object-cover object-center"
                />
                {uploads.success.includes(image.id) && (
                  <CheckCircleFilled className="absolute right-2 top-2 text-teal-600" />
                )}
                {uploads.failed.includes(image.id) && (
                  <CloseCircleFilled className="absolute right-2 top-2 text-rose-600" />
                )}
                <button
                  aria-label="Delete"
                  type="button"
                  className="absolute right-2 top-2 hidden rounded-md border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-200 group-hover:z-10 group-hover:block"
                  onClick={onRemove(image)}
                >
                  <Delete className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Upload.Dragger
          multiple
          withCredentials
          name="image"
          listType="picture"
          accept="image/*"
          rootClassName="w-full"
          showUploadList={false}
          className="block h-40 !w-48 [&_.ant-upload-drag]:!border-blue-600"
          beforeUpload={beforeUpload}
        >
          <div className="flex flex-col">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-base after:content-none">
              Click or drag file to this area to upload
            </p>
          </div>
        </Upload.Dragger>
      </div>
      <Actions
        {...{
          uploading,
          onClose,
          onTriggerUpload,
        }}
      />
    </div>
  );
}
