import { Suspense, lazy } from 'react';
import type { DOMConversionMap, DOMExportOutput, EditorConfig, NodeKey } from 'lexical';

import { DecoratorNode } from 'lexical';
// eslint-disable-next-line import/no-cycle
import {
  $convertInlineImageElement,
  $createInlineImageNode,
  Position,
  SerializedInlineImageNode,
  UpdateInlineImagePayload,
} from '../utils';
// eslint-disable-next-line import/no-cycle
const InlineImage = lazy(() => import('./Image'));

export default class InlineImageNode extends DecoratorNode<JSX.Element> {
  __src: string;

  __alt: string;

  __width: number;

  __height: number;

  __position: Position;

  static getType(): string {
    return 'inline-image';
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__src,
      node.__alt,
      node.__position,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedInlineImageNode): InlineImageNode {
    const { alt, height, width, src, position } = serializedNode;
    const node = $createInlineImageNode({
      src,
      alt,
      width,
      height,
      position,
    });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (_: Node) => ({
        conversion: $convertInlineImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    alt: string,
    position: Position,
    width: number,
    height: number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
    this.__position = position;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__alt);
    element.setAttribute('width', this.__width?.toString());
    element.setAttribute('height', this.__height?.toString());
    return { element };
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      version: 1,
      type: 'inline-image',
      alt: this.getAltText(),
      position: this.__position,
      src: this.getSrc(),
      height: !this.__height ? 0 : this.__height,
      width: !this.__width ? 0 : this.__width,
    };
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__alt;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__alt = altText;
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  getPosition(): Position {
    return this.__position;
  }

  setPosition(position: Position): void {
    const writable = this.getWritable();
    writable.__position = position;
  }

  update(payload: UpdateInlineImagePayload): void {
    const writable = this.getWritable();
    const { alt, position } = payload;
    if (alt !== undefined) {
      writable.__alt = alt;
    }
    if (position !== undefined) {
      writable.__position = position;
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const className = `${config.theme.inlineImage} position-${this.__position}`;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(prevNode: InlineImageNode, dom: HTMLElement, config: EditorConfig): false {
    const position = this.__position;
    if (position !== prevNode.__position) {
      const className = `${config.theme.inlineImage} position-${position}`;
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
        <InlineImage
          src={this.__src}
          alt={this.__alt}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          position={this.__position}
        />
      </Suspense>
    );
  }
}
