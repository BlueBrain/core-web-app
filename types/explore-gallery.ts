export type SingleGallery = {
  title: string;
  imageCover: string;
  description: string;
  slug: {
    current: string;
  };
};

export type GalleryImagesType = {
  name: string;
  src: string;
  alt: string;
  credit: string;
  year: string;
  software: string;
};

export type SingleGalleryContentType = {
  name: string;
  description: string;
  images: GalleryImagesType[];
};