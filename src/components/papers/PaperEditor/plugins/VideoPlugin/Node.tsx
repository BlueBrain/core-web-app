import { Suspense, lazy } from 'react';
import type { DOMExportOutput, EditorConfig, NodeKey } from 'lexical';

import { DecoratorNode } from 'lexical';

// eslint-disable-next-line import/no-cycle
import { $createVideoNode, SerializedVideoNode, UpdateVideoPayload } from './utils';
import { Position } from '@/components/papers/uploader/types';

// eslint-disable-next-line import/no-cycle
const Video = lazy(() => import('./Video'));

const NODE_TYPE = 'video';
export default class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;

  __title?: string;

  __description?: string;

  __position: Position;

  constructor(
    src: string,
    position: Position,
    title?: string,
    description?: string,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__title = title;
    this.__description = description;
    this.__position = position;
  }

  static getType(): string {
    return NODE_TYPE;
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__position, node.__title, node.__description, node.__key);
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { title, src, position } = serializedNode;
    const node = $createVideoNode({
      src,
      title,
      position,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('video');
    element.setAttribute('src', this.__src);
    element.setAttribute('poster', ''); // TODO: generate the thumbnail
    return { element };
  }

  exportJSON(): SerializedVideoNode {
    return {
      version: 1,
      type: NODE_TYPE,
      position: this.__position,
      src: this.getSrc(),
      title: this.getTitleText(),
      description: this.getDescription(),
    };
  }

  getSrc(): string {
    return this.__src;
  }

  getTitleText(): string | undefined {
    return this.__title;
  }

  getDescription(): string | undefined {
    return this.__description;
  }

  setTitle(title: string): void {
    const writable = this.getWritable();
    writable.__title = title;
  }

  getPosition(): Position {
    return this.__position;
  }

  setPosition(position: Position): void {
    const writable = this.getWritable();
    writable.__position = position;
  }

  update(payload: UpdateVideoPayload): void {
    const writable = this.getWritable();
    const { title, description } = payload;

    if (title !== undefined) {
      writable.__title = title;
    }
    if (description !== undefined) {
      writable.__description = description;
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('div');
    const className = `${config.theme.video} position-${this.__position}`;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(prevNode: VideoNode, dom: HTMLElement, config: EditorConfig): false {
    const position = this.__position;
    if (position !== prevNode.__position) {
      const className = `${config.theme.video} position-${position}`;
      if (className !== undefined) {
        // eslint-disable-next-line no-param-reassign
        dom.className = className;
      }
    }
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <Video
          nodeKey={this.getKey()}
          src={this.__src}
          title={this.__title}
          position={this.__position}
        />
      </Suspense>
    );
  }
}
