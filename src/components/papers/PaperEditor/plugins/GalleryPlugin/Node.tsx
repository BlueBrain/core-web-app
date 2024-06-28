import { Suspense, lazy } from 'react';
import { DecoratorNode, EditorConfig, NodeKey } from 'lexical';

// eslint-disable-next-line import/no-cycle
import { $createGalleryNode, SerializedGalleryNode } from '../ImagePlugin/utils';
// eslint-disable-next-line import/no-cycle
const Gallery = lazy(() => import('./Gallery'));
export interface UpdateGalleryImages {
  contentUrl?: string;
}
export interface UpdateGalleryDetails {
  title?: string;
  description?: string;
}

export default class GalleryNode extends DecoratorNode<JSX.Element> {
  __images: Array<string>;

  __title: string;

  __description: string;

  constructor(title: string, description: string, images: Array<string>, key?: NodeKey) {
    super(key);
    this.__images = images;
    this.__title = title;
    this.__description = description;
  }

  static getType(): string {
    return 'gallery';
  }

  static clone(node: GalleryNode): GalleryNode {
    return new GalleryNode(node.__title, node.__description, node.__images, node.__key);
  }

  static importJSON(serializedNode: SerializedGalleryNode): GalleryNode {
    const { title, description, images } = serializedNode;
    const node = $createGalleryNode(title, description, images);
    return node;
  }

  exportJSON(): SerializedGalleryNode {
    return {
      type: 'gallery',
      version: 1,
      images: this.__images,
      title: this.__title,
      description: this.__description,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const { theme } = config;
    const className = theme.gallery ?? 'editor-gallery';
    div.className = className;
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getTitle(): string {
    return this.__title;
  }

  getDescription(): string {
    return this.__description;
  }

  getImages(): Array<string> {
    return this.__images;
  }

  update(payload: UpdateGalleryDetails): void {
    const writable = this.getWritable();
    const { title, description } = payload;
    if (title !== undefined) {
      writable.__title = title;
    }
    if (description !== undefined) {
      writable.__description = description;
    }
  }

  removeImage(payload: UpdateGalleryImages): void {
    const writable = this.getWritable();
    const { contentUrl } = payload;
    if (contentUrl !== undefined) {
      writable.__images = this.__images.filter((o) => o !== contentUrl);
    }
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <Gallery
          nodeKey={this.getKey()}
          images={this.__images}
          title={this.__title}
          description={this.__description}
        />
      </Suspense>
    );
  }
}
