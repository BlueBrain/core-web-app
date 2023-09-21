export type GalleryImagesType = {
  name: string;
  credits: string;
  year: number;
  software: string;
  singleImage: {
    asset: {
      _ref: string;
      _type: string;
    }
  }
};

export type SingleGalleryContentType = {
  name: string;
  description: string;
  slug: {
    current: string;
    };
  imageList: GalleryImagesType[];
};
