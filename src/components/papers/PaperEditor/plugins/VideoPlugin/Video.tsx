import { useCallback, useEffect, useRef, useState } from 'react';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Popover, Select } from 'antd';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';

// eslint-disable-next-line import/no-cycle
import VideoNode from './Node';
import { $isVideoNode } from './utils';
import { Position } from '@/components/papers/uploader/types';
import { VideoThumbnailMetadata, generateVideoThumbnail } from '@/components/papers/uploader/utils';
import { classNames } from '@/util/utils';
import { EditPenSquare } from '@/components/icons/EditorIcons';

type Props = {
  nodeKey: NodeKey;
  title?: string;
  description?: string;
  src: string;
  position: Position;
};

// TODO: refactor position modifier component for different plugins
function UpdateVideoPosition({
  editor,
  nodeKey,
  videoPosition,
}: {
  editor: LexicalEditor;
  nodeKey: NodeKey;
  videoPosition: Position;
}) {
  const editorState = editor.getEditorState();
  const node = editorState.read(() => $getNodeByKey(nodeKey) as VideoNode);

  const [position, setPosition] = useState<Position>(node.getPosition());
  const [open, setOpen] = useState(false);

  const onOpenChange = (value: boolean) => setOpen(value);
  const onPositionChange = (value: Position) => {
    setPosition(value);
    if (node) {
      editor.update(() => {
        node.setPosition(value);
      });
    }
    setOpen(false);
  };

  return (
    <Popover
      title="Inline Position"
      placement={videoPosition === 'left' ? 'bottomLeft' : 'bottomRight'}
      trigger="click"
      arrow={false}
      open={open}
      onOpenChange={onOpenChange}
      content={
        <Select
          size="large"
          defaultValue={undefined}
          value={position}
          onChange={onPositionChange}
          className="w-full [&_.ant-select-selector]:rounded-md"
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'full', label: 'Full' },
          ]}
        />
      }
    >
      <button
        type="button"
        aria-label="Edit position"
        className={classNames(
          'z-10 hidden group-hover:flex peer-hover:flex',
          'absolute top-4 rounded-md border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-200',
          position === 'left' ? 'left-4' : 'right-4'
        )}
      >
        <EditPenSquare />
      </button>
    </Popover>
  );
}

function Video({ nodeKey, src, title, description, position }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const [thumbnail, setThumbnail] = useState<VideoThumbnailMetadata>({
    url: null,
    height: 0,
    width: 0,
  });

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isVideoNode(node)) {
          node.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const $onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [isSelected]
  );

  const $onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [editor, setSelected]
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;
      if (event.target === videoRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isSelected, setSelected, clearSelection]
  );

  useEffect(() => {
    (async () => {
      if (src) {
        const { url, width, height } = await generateVideoThumbnail(src);
        setThumbnail({ url, width, height });
      }
    })();
  }, [src]);

  useEffect(() => {
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === videoRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(KEY_DELETE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW)
    );
    rootElement?.addEventListener('click', onClick);
    return () => {
      unregister();
      rootElement?.removeEventListener('click', onClick);
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    $onDelete,
    $onEnter,
    $onEscape,
    setSelected,
    onClick,
  ]);

  return (
    <div className={classNames('group relative h-full w-full p-2', isSelected ? 'focused' : '')}>
      <UpdateVideoPosition nodeKey={nodeKey} editor={editor} videoPosition={position} />
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        controls
        src={src}
        width={thumbnail.width}
        height={thumbnail.height}
        aria-label={title}
        aria-description={description}
        className="peer"
        ref={videoRef}
      />
    </div>
  );
}

export default Video;
