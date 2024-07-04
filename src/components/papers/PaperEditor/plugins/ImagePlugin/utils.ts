import {
  $applyNodeReplacement,
  DOMConversionOutput,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  createCommand,
} from 'lexical';

// eslint-disable-next-line import/no-cycle
import GalleryNode from '../GalleryPlugin/Node';
// eslint-disable-next-line import/no-cycle
import InlineImageNode from './InlineImage/Node';
import { Position } from '@/components/papers/uploader/types';

export interface ImagePayload {
  key?: NodeKey;
  alt: string;
  src: string;
  width?: number;
  height?: number;
  maxWidth?: number;
}
export type InsertImagePayload = Readonly<ImagePayload>;

export type SerializedInlineImageNode = Spread<
  {
    alt: string;
    height: number;
    src: string;
    width: number;
    position?: Position;
  },
  SerializedLexicalNode
>;

export type GalleryPayload = {
  title: string;
  description: string;
  images: Array<string>;
};

export type InsertGalleryPayload = Readonly<GalleryPayload>;

export type SerializedGalleryNode = Spread<GalleryPayload, SerializedLexicalNode>;

export interface InlineImagePayload {
  key?: NodeKey;
  alt: string;
  src: string;
  width: number;
  height: number;
  position?: Position;
}
export type InsertInlineImagePayload = Readonly<InlineImagePayload>;
export interface UpdateInlineImagePayload {
  alt?: string;
  position?: Position;
}
export type ImageType = 'image' | 'inline-image';

export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImagePayload> = createCommand(
  'INSERT_INLINE_IMAGE_COMMAND'
);

export const INSERT_GALLERY_COMMAND: LexicalCommand<GalleryPayload> =
  createCommand('INSERT_GALLERY_COMMAND');

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand(
  'RIGHT_CLICK_IMAGE_COMMAND'
);

export function $convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt, src, width, height } = domNode;
    const node = $createInlineImageNode({ alt, height, src, width });
    return { node };
  }
  return null;
}

export function $isInlineImageNode(node: LexicalNode | null | undefined): node is InlineImageNode {
  return node instanceof InlineImageNode;
}

export function $isGalleryNode(node: LexicalNode | null | undefined): node is GalleryNode {
  return node instanceof GalleryNode;
}

export function $createInlineImageNode({
  alt,
  position,
  height,
  src,
  width,
  key,
}: InlineImagePayload): InlineImageNode {
  return $applyNodeReplacement(new InlineImageNode(src, alt, position, width, height, key));
}

export function $createGalleryNode(
  title: string,
  description: string,
  images: Array<string>
): GalleryNode {
  return $applyNodeReplacement(new GalleryNode(title, description, images));
}
