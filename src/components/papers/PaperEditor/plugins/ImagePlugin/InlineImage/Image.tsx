import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { Popover, Select } from 'antd';
import NextImage from 'next/image';

import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import type { BaseSelection, LexicalEditor, NodeKey } from 'lexical';

import BrokenImage from '../BrokenImage';
// eslint-disable-next-line import/no-cycle
import { Position, $isInlineImageNode, RIGHT_CLICK_IMAGE_COMMAND } from '../utils';
// eslint-disable-next-line import/no-cycle
import InlineImageNode from './Node';
import { classNames } from '@/util/utils';

import './style.css';

function UpdateImagePosition({
  editor,
  nodeKey,
  imgPosition,
}: {
  editor: LexicalEditor;
  nodeKey: NodeKey;
  imgPosition: Position;
}) {
  const editorState = editor.getEditorState();
  const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode);

  const [position, setPosition] = useState<Position>(node.getPosition());
  const [open, setOpen] = useState(false);

  const onOpenChange = (value: boolean) => setOpen(value);
  const onPositionChange = (value: Position) => {
    setPosition(value);
    if (node) {
      editor.update(() => {
        node.update({ position: value });
      });
    }
    setOpen(false);
  };

  return (
    <Popover
      title="Inline Position"
      placement={imgPosition === 'left' ? 'bottomLeft' : 'bottomRight'}
      trigger="click"
      arrow={false}
      open={open}
      onOpenChange={onOpenChange}
      className="hidden group-hover:flex"
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
        className={classNames(
          'absolute top-4 rounded-md border border-gray-400 bg-white px-4  py-1 text-base shadow-lg',
          position === 'left' ? 'left-4' : 'right-4'
        )}
      >
        Edit
      </button>
    </Popover>
  );
}

export default function InlineImage({
  src,
  alt,
  nodeKey,
  width,
  height,
  position,
}: {
  nodeKey: NodeKey;
  alt: string;
  src: string;
  width?: number;
  height?: number;
  position: Position;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [isLoadError, setIsLoadError] = useState<boolean>(false);

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isInlineImageNode(node)) {
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

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection();
        const domElement = event.target as HTMLElement;
        if (
          domElement.tagName === 'IMG' &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent);
        }
      });
    },
    [editor]
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (event.target === imageRef.current) {
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
    let isMounted = true;
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
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
          if (event.target === imageRef.current) {
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
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, $onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW),
      editor.registerCommand<MouseEvent>(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand<MouseEvent>(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW)
    );
    rootElement?.addEventListener('contextmenu', onRightClick);
    return () => {
      isMounted = false;
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    $onDelete,
    $onEnter,
    $onEscape,
    onRightClick,
    setSelected,
    onClick,
  ]);

  return (
    <Suspense fallback={null}>
      {isLoadError ? (
        <BrokenImage />
      ) : (
        <div className="group">
          <UpdateImagePosition nodeKey={nodeKey} editor={editor} imgPosition={position} />
          <NextImage
            className={classNames(
              isSelected ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : undefined,
              'h-full w-full object-contain'
            )}
            ref={imageRef}
            src={src}
            alt={alt}
            width={width ?? undefined}
            height={height ?? undefined}
            fill={!width || !height}
            onError={() => setIsLoadError(true)}
          />
        </div>
      )}
    </Suspense>
  );
}
