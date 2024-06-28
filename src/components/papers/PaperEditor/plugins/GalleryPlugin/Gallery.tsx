import { ChangeEventHandler, Suspense, useState } from 'react';
import { Button, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { $getNodeByKey, NodeKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// eslint-disable-next-line import/no-cycle
import GalleryNode from './Node';
import { classNames } from '@/util/utils';
import { Delete, EditPenSquare, Save } from '@/components/icons/EditorIcons';

export default function Gallery({
  nodeKey,
  title,
  description,
  images,
}: {
  nodeKey: NodeKey;
  title: string;
  description: string;
  images: Array<string>;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const editorState = editor.getEditorState();
  const node = editorState.read(() => $getNodeByKey(nodeKey) as GalleryNode);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setTitle] = useState(() => title);
  const [newDescription, setDescription] = useState(() => description);

  const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDescription(e.target.value);
  };
  const onTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const onItemDelete = (url: string) => () => {
    if (node) {
      editor.update(() => {
        node.removeImage({ contentUrl: url });
      });
    }
  };

  const onDelete = () => {
    if (node) {
      editor.update(() => {
        node.remove();
      });
    }
  };

  const onEdit = () => setEditMode(true);
  const onSave = () => {
    if (node) {
      editor.update(() => {
        node.update({
          title: newTitle,
          description: newDescription,
        });
      });
      setEditMode(false);
    }
  };

  return (
    <Suspense fallback={null}>
      <div className="group/gallery relative my-4 flex w-full flex-col rounded-lg bg-gray-100 p-4">
        <div className="flex w-90percent flex-col gap-2">
          {editMode ? (
            <input
              name="title"
              placeholder="Title"
              value={newTitle}
              defaultValue={newTitle}
              onChange={onTitleChange}
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-base"
            />
          ) : (
            <h1 className="mb-2 text-xl font-bold text-black">{title}</h1>
          )}
          {editMode ? (
            <textarea
              rows={3}
              placeholder="Description"
              name="description"
              value={newDescription}
              defaultValue={newDescription}
              onChange={onDescriptionChange}
              className="h-full w-full rounded-md border border-gray-200 px-4 py-3 text-base"
            />
          ) : (
            <p className="w-3/4 text-justify text-base font-light">{description}</p>
          )}
        </div>
        {Boolean(images.length) && (
          <ul className="flex w-full flex-wrap gap-2 py-3">
            {images.map((img) => (
              <li
                key={img}
                className="group relative flex h-40 w-48 items-center gap-2 rounded-md border border-gray-200"
              >
                <Image
                  key={img}
                  src={img}
                  rootClassName="w-full h-full"
                  className="!h-full w-full rounded-md object-cover object-center"
                  alt="gallery thumbnail"
                />
                <Button
                  htmlType="button"
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  className={classNames(
                    'absolute left-2 top-2 border border-gray-200 shadow-md',
                    editMode ? 'hidden !bg-white group-hover:block' : 'hidden'
                  )}
                  onClick={onItemDelete(img)}
                />
              </li>
            ))}
          </ul>
        )}
        <div className="absolute right-2 top-2 hidden items-center justify-between gap-2 group-hover/gallery:flex">
          <button
            aria-label={editMode ? 'Save' : 'Edit'}
            type="button"
            className="rounded-md border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-200"
            onClick={editMode ? onSave : onEdit}
          >
            {editMode ? <Save className="text-lg" /> : <EditPenSquare className="text-lg" />}
          </button>
          <button
            aria-label="Delete"
            type="button"
            className="rounded-md border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-200"
            onClick={onDelete}
          >
            <Delete className="text-lg" />
          </button>
        </div>
      </div>
    </Suspense>
  );
}
