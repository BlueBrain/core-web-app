/* eslint-disable no-bitwise */
import { RcFile } from 'antd/lib/upload';
import { GetProp, UploadFile, UploadProps } from 'antd';
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

import { Distribution } from '@/types/nexus';

export interface ImagePayload {
  key?: NodeKey;
  alt: string;
  src: string;
  width?: number;
  height?: number;
  maxWidth?: number;
}
export type Position = 'left' | 'right' | 'full' | undefined;
export type InsertImagePayload = Readonly<ImagePayload>;

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

export type UploadImage = {
  id: string;
  file: UploadFile;
  preview: string;
  alt?: string;
  name?: string;
  position?: Position;
};

export type UploaderGeneratorResponse =
  | {
      source: 'image';
      status: 'success' | 'failed';
      id: string;
    }
  | {
      source: 'resource';
      status: 'success' | 'failed';
    }
  | null;

export type OnUploadCallback = (payload: Array<Distribution>, images: Array<UploadImage>) => void;
export type OnUploadInput = {
  accessToken: string;
  uploadUrl: string;
  images: Array<UploadImage>;
  location: {
    id: string;
    org: string;
    project: string;
  };
  callback?: OnUploadCallback;
};

export type UploaderGenerator = (
  images: Array<UploadImage>,
  cb?: OnUploadCallback
) => AsyncGenerator<UploaderGeneratorResponse, void, unknown>;

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

export const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
};

export const getBase64 = (file: FileType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getRcFileImageUrl = async (file: RcFile) => {
  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer]);
  return URL.createObjectURL(blob);
};

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
}
