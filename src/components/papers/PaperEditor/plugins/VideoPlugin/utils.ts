import { GetProp, UploadProps } from 'antd';
import {
  $applyNodeReplacement,
  $getSelection,
  $isNodeSelection,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  createCommand,
} from 'lexical';

// eslint-disable-next-line import/no-cycle
import VideoNode from './Node';
import { Position } from '@/components/papers/uploader/types';

export interface VideoPayload {
  key?: NodeKey;
  title?: string;
  description?: string;
  src: string;
  position?: Position;
}

export type UpdateVideoPayload = {
  title?: string;
  description?: string;
};

export type InsertVideoPayload = Readonly<VideoPayload>;

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type SerializedVideoNode = Spread<
  {
    title?: string;
    description?: string;
    src: string;
    position?: Position;
  },
  SerializedLexicalNode
>;

export const INSERT_VIDEO_COMMAND: LexicalCommand<VideoPayload> =
  createCommand('INSERT_VIDEO_COMMAND');

export function $getVideoInSelection(): VideoNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isVideoNode(node) ? node : null;
}

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
  return node instanceof VideoNode;
}

export function $createVideoNode({
  key,
  title,
  description,
  src,
  position,
}: VideoPayload): VideoNode {
  return $applyNodeReplacement(new VideoNode(src, position, title, description, key));
}
